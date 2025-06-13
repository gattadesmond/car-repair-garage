"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronRight,
  Search,
  Settings,
  Car,
  Wrench,
  Palette,
  Trash2,
  X,
} from "lucide-react"

// Interface cho dữ liệu triệu chứng
interface SymptomNode {
  id: number
  name: string
  children?: SymptomNode[]
}

// Interface cho triệu chứng đã chọn
export interface SelectedSymptom {
  id: number
  name: string
  path: string[] // Đường dẫn từ root đến node này
}

interface SymptomSelectorProps {
  selectedSymptoms: SelectedSymptom[]
  onSymptomsChange: (symptoms: SelectedSymptom[]) => void
}

// Hàm đệ quy để tìm tất cả các leaf nodes (triệu chứng cuối cấp)
const findLeafNodes = (node: SymptomNode, path: string[] = []): SelectedSymptom[] => {
  const currentPath = [...path, node.name]
  
  if (!node.children || node.children.length === 0) {
    // Đây là leaf node (triệu chứng cuối cấp)
    return [{
      id: node.id,
      name: node.name,
      path: currentPath
    }]
  }
  
  // Đệ quy tìm leaf nodes trong children
  return node.children.flatMap(child => findLeafNodes(child, currentPath))
}

// Hàm tìm kiếm triệu chứng
const searchSymptoms = (nodes: SymptomNode[], searchTerm: string): SelectedSymptom[] => {
  const allLeafNodes = nodes.flatMap(node => findLeafNodes(node))
  
  if (!searchTerm.trim()) {
    return allLeafNodes
  }
  
  return allLeafNodes.filter(symptom => 
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    symptom.path.some(pathItem => pathItem.toLowerCase().includes(searchTerm.toLowerCase()))
  )
}

// Component hiển thị cây triệu chứng
const SymptomTree: React.FC<{
  nodes: SymptomNode[]
  selectedSymptoms: SelectedSymptom[]
  onSymptomToggle: (symptom: SelectedSymptom) => void
  expandedNodes: Set<number>
  onToggleExpand: (nodeId: number) => void
  level?: number
}> = ({ nodes, selectedSymptoms, onSymptomToggle, expandedNodes, onToggleExpand, level = 0 }) => {
  return (
    <div className={`space-y-2 ${level > 0 ? 'ml-4 border-l-2 border-gray-200 pl-4' : ''}`}>
      {nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0
        const isExpanded = expandedNodes.has(node.id)
        const leafNodes = hasChildren ? [] : findLeafNodes(node)
        const isSelected = leafNodes.some(leaf => 
          selectedSymptoms.some(selected => selected.id === leaf.id)
        )
        
        if (hasChildren) {
          return (
            <Collapsible key={node.id} open={isExpanded} onOpenChange={() => onToggleExpand(node.id)}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="font-medium text-sm">{node.name}</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SymptomTree
                  nodes={node.children || []}
                  selectedSymptoms={selectedSymptoms}
                  onSymptomToggle={onSymptomToggle}
                  expandedNodes={expandedNodes}
                  onToggleExpand={onToggleExpand}
                  level={level + 1}
                />
              </CollapsibleContent>
            </Collapsible>
          )
        } else {
          // Đây là leaf node (triệu chứng có thể chọn)
          const symptom = leafNodes[0]
          return (
            <div key={node.id} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded">
              <Checkbox
                id={`symptom-${node.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSymptomToggle(symptom)
                  } else {
                    onSymptomToggle(symptom)
                  }
                }}
                className="mt-0.5"
              />
              <Label
                htmlFor={`symptom-${node.id}`}
                className="text-sm leading-tight cursor-pointer flex-1"
              >
                {node.name}
              </Label>
            </div>
          )
        }
      })}
    </div>
  )
}

export default function SymptomSelector({ selectedSymptoms, onSymptomsChange }: SymptomSelectorProps) {
  const [symptomData, setSymptomData] = useState<SymptomNode[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  console.log('SymptomSelector render:', { 
    symptomDataLength: symptomData.length, 
    activeCategory, 
    loading, 
    selectedSymptomsLength: selectedSymptoms.length 
  })

  // Load dữ liệu triệu chứng
  useEffect(() => {
    const loadSymptomData = async () => {
      try {
        console.log('Loading symptom data...')
        const response = await fetch('/trieuchung.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: SymptomNode[] = await response.json()
        console.log('Symptom data loaded:', data.length, 'categories')
        setSymptomData(data)
        if (data.length > 0) {
          setActiveCategory(data[0].name)
          console.log('Active category set to:', data[0].name)
        }
      } catch (error) {
        console.error('Error loading symptom data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSymptomData()
  }, [])

  // Lấy danh mục hiện tại
  const currentCategory = useMemo(() => {
    return symptomData.find(category => category.name === activeCategory)
  }, [symptomData, activeCategory])

  // Tìm kiếm triệu chứng
  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || !currentCategory) return []
    return searchSymptoms([currentCategory], searchTerm)
  }, [currentCategory, searchTerm])

  // Xử lý toggle triệu chứng
  const handleSymptomToggle = (symptom: SelectedSymptom) => {
    const isSelected = selectedSymptoms.some(s => s.id === symptom.id)
    
    if (isSelected) {
      // Bỏ chọn
      onSymptomsChange(selectedSymptoms.filter(s => s.id !== symptom.id))
    } else {
      // Chọn
      onSymptomsChange([...selectedSymptoms, symptom])
    }
  }

  // Xử lý toggle expand node
  const handleToggleExpand = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  // Xóa tất cả triệu chứng đã chọn
  const handleClearAll = () => {
    onSymptomsChange([])
  }

  // Xóa một triệu chứng cụ thể
  const handleRemoveSymptom = (symptomId: number) => {
    onSymptomsChange(selectedSymptoms.filter(s => s.id !== symptomId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Đang tải dữ liệu triệu chứng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Header với thông tin triệu chứng đã chọn */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Chọn triệu chứng</h2>
          {selectedSymptoms.length > 0 && (
            <Badge variant="default" className="bg-blue-600">
              {selectedSymptoms.length} đã chọn
            </Badge>
          )}
        </div>
        {selectedSymptoms.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Hiển thị triệu chứng đã chọn */}
      {selectedSymptoms.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Triệu chứng đã chọn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <Badge
                  key={symptom.id}
                  variant="secondary"
                  className="flex items-center space-x-1 px-2 py-1"
                >
                  <span className="text-xs">{symptom.name}</span>
                  <button
                    onClick={() => handleRemoveSymptom(symptom.id)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs cho các danh mục */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-3">
          {symptomData.map((category) => {
            const categoryIcon = category.name === "Sửa chữa chung" ? Settings :
                               category.name === "Đồng sơn" ? Palette :
                               category.name === "Dọn xe" ? Car : Wrench
            const IconComponent = categoryIcon
            
            return (
              <TabsTrigger key={category.id} value={category.name} className="flex items-center space-x-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {symptomData.map((category) => (
          <TabsContent key={category.id} value={category.name} className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center space-x-2">
                    {category.name === "Sửa chữa chung" && <Settings className="h-5 w-5" />}
                    {category.name === "Đồng sơn" && <Palette className="h-5 w-5" />}
                    {category.name === "Dọn xe" && <Car className="h-5 w-5" />}
                    <span>{category.name}</span>
                  </CardTitle>
                  
                  {/* Tìm kiếm */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm triệu chứng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {searchTerm.trim() ? (
                  // Hiển thị kết quả tìm kiếm
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm mb-3">
                      Kết quả tìm kiếm ({searchResults.length})
                    </h3>
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((symptom) => {
                          const isSelected = selectedSymptoms.some(s => s.id === symptom.id)
                          return (
                            <div key={symptom.id} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded border">
                              <Checkbox
                                id={`search-symptom-${symptom.id}`}
                                checked={isSelected}
                                onCheckedChange={() => handleSymptomToggle(symptom)}
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`search-symptom-${symptom.id}`}
                                  className="text-sm leading-tight cursor-pointer block"
                                >
                                  {symptom.name}
                                </Label>
                                <div className="text-xs text-gray-500 mt-1">
                                  {symptom.path.join(' > ')}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Không tìm thấy triệu chứng nào phù hợp
                      </p>
                    )}
                  </div>
                ) : (
                  // Hiển thị cây triệu chứng
                  <div className="space-y-2">
                    {category.children && (
                      <SymptomTree
                        nodes={category.children}
                        selectedSymptoms={selectedSymptoms}
                        onSymptomToggle={handleSymptomToggle}
                        expandedNodes={expandedNodes}
                        onToggleExpand={handleToggleExpand}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
