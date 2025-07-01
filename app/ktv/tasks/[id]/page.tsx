"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Wrench, Save, CheckCircle, Clock, FileText, Camera, Calendar, User, Eye } from "lucide-react"
import RoleLayout from "@/components/role-layout"
import ImageUpload from "@/components/image-upload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getWorkOrders, saveWorkOrders, getCurrentUser, ImageFile } from "@/lib/demo-data"

interface SavedImage {
  id: string
  name: string
  type: "camera" | "upload"
  data: string // base64
  size: number
}

interface RepairItem {
  item: string
  requirement: string
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [workOrder, setWorkOrder] = useState<any>(null)
  const [task, setTask] = useState<any>(null)
  const [taskStatus, setTaskStatus] = useState<string>("")
  const [taskNotes, setTaskNotes] = useState<string>("")
  const [taskImages, setTaskImages] = useState<ImageFile[]>([])
  const [images, setImages] = useState<SavedImage[]>([])
  const [repairItems, setRepairItems] = useState<RepairItem[]>([
    { item: "Thay nhớt lọc", requirement: "Thay" },
    { item: "Rô tuyn trái đứng lỏng", requirement: "Thay" }
  ])

  useEffect(() => {
    fetchData()
  }, [params.id])
  
  useEffect(() => {
    if (workOrder) {
      fetchImages()
    }
  }, [workOrder])
  
  const fetchImages = () => {
    if (!workOrder) return;
    
    try {
      const imageKey = `images-${workOrder.id}`
      const storedImages = localStorage.getItem(imageKey)
      
      if (storedImages && storedImages.trim() !== '') {
        try {
          const parsedImages = JSON.parse(storedImages)
          
          // Kiểm tra xem dữ liệu có phải là mảng không
          if (Array.isArray(parsedImages)) {
            setImages(parsedImages)
          } else {
            console.warn("Stored images data is not an array, resetting to empty array")
            setImages([])
          }
        } catch (error) {
          console.warn("Error parsing images, resetting to empty array:", error)
          setImages([])
          
          // Xóa dữ liệu không hợp lệ khỏi localStorage
          localStorage.removeItem(imageKey)
        }
      } else {
        // Không có dữ liệu hoặc dữ liệu rỗng
        setImages([])
      }
    } catch (error) {
      // Xử lý lỗi truy cập localStorage (ví dụ: trong chế độ ẩn danh)
      console.warn("Error accessing localStorage:", error)
      setImages([])
    }
  }
  
  const viewImage = (imageData: string) => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Xem hình ảnh</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f0f0; }
              img { max-width: 100%; max-height: 90vh; object-fit: contain; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            </style>
          </head>
          <body>
            <img src="${imageData}" alt="Chi tiết hình ảnh" />
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  const fetchData = () => {
    const user = getCurrentUser()
    setCurrentUser(user)

    // Kiểm tra nếu người dùng không phải là KTV hoặc admin, chuyển hướng về dashboard
    if (user?.role !== "ktv" && user?.role !== "admin") {
      router.push(`/dashboard/${user?.role || 'cv'}`)
      return
    }

    // Tìm task trong tất cả các work order
    const workOrders = getWorkOrders()
    let foundTask = null
    let foundWorkOrder = null

    for (const order of workOrders) {
      if (order.repair_tasks && Array.isArray(order.repair_tasks)) {
        const task = order.repair_tasks.find((t: any) => t.id === params.id)
        if (task) {
          foundTask = task
          foundWorkOrder = order
          break
        }
      }
    }

    if (foundTask && foundWorkOrder) {
      // Kiểm tra xem task có được gán cho KTV hiện tại không (chỉ áp dụng cho KTV, không áp dụng cho admin)
      if (user?.role === "ktv" && foundTask.assigned_technician !== user?.id) {
        setError("Bạn không được phân công cho công việc này")
        setLoading(false)
        return
      }

      setWorkOrder(foundWorkOrder)
      setTask(foundTask)
      setTaskStatus(foundTask.status || "pending")
      setTaskNotes(foundTask.notes || "")
      setTaskImages(foundTask.task_images || [])
      
      // Tải các hạng mục sửa chữa nếu có
      if (foundTask.repair_items && Array.isArray(foundTask.repair_items) && foundTask.repair_items.length > 0) {
        setRepairItems(foundTask.repair_items)
      }
    } else {
      setError("Không tìm thấy công việc")
    }

    setLoading(false)
  }

  const handleSaveTask = () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const workOrders = getWorkOrders()
      const orderIndex = workOrders.findIndex((o) => o.id === workOrder.id)

      if (orderIndex !== -1 && workOrders[orderIndex].repair_tasks) {
        // Cập nhật task trong work order
        const updatedTasks = workOrders[orderIndex].repair_tasks.map((t: any) => {
          if (t.id === task.id) {
            return {
              ...t,
              status: taskStatus,
              notes: taskNotes,
              task_images: taskImages,
              repair_items: repairItems,
              updated_at: new Date().toISOString()
            }
          }
          return t
        })

        workOrders[orderIndex] = {
          ...workOrders[orderIndex],
          repair_tasks: updatedTasks,
          updated_at: new Date().toISOString()
        }

        saveWorkOrders(workOrders)
        setSuccess("Đã cập nhật công việc thành công")
        
        // Cập nhật state
        setTask({
          ...task,
          status: taskStatus,
          notes: taskNotes,
          task_images: taskImages,
          repair_items: repairItems,
          updated_at: new Date().toISOString()
        })
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật công việc")
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Đang chờ", variant: "secondary" as const },
      in_progress: { label: "Đang thực hiện", variant: "outline" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  if (loading) {
    return (
      <RoleLayout role={currentUser?.role || "ktv"} title="Chi tiết công việc">
        <div className="text-center py-8">Đang tải...</div>
      </RoleLayout>
    )
  }

  if (error && !task) {
    return (
      <RoleLayout role={currentUser?.role || "ktv"} title="Chi tiết công việc">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout role={currentUser?.role || "ktv"} title="Chi tiết công việc">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center space-x-2">
            {task && <Badge {...getStatusBadge(task.status || "pending")}>{getStatusBadge(task.status || "pending").label}</Badge>}
          </div>
        </div>

        {/* Task Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span>Thông tin công việc</span>
            </CardTitle>
            <CardDescription>
              Thuộc phiếu tiếp nhận: {workOrder?.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {task?.service_type === "cleaning" && "Dọn Dẹp"}
                  {task?.service_type === "painting" && "Đồng Sơn"}
                  {task?.service_type === "mechanical" && "Cơ"}
                  {task?.service_type === "electrical" && "Điện"}
                  {task?.service_type === "cooling" && "Lạnh"}
                </Badge>
                <h3 className="text-lg font-medium">{task?.name}</h3>
              </div>
              
              {task?.description && (
                <div className="mt-2">
                  <p className="text-gray-600">{task.description}</p>
                </div>
              )}

              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin xe</h4>
                    <div className="space-y-1">
                      <p>{workOrder?.car_info} - {workOrder?.license_plate}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin khách hàng</h4>
                    <div className="space-y-1">
                      <p>{workOrder?.customer_name}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Thông tin tiếp nhận */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Thông tin tiếp nhận</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Ngày tiếp nhận:</span>
                    <span>{workOrder?.received_date ? new Date(workOrder.received_date).toLocaleDateString("vi-VN") : "Không có"}</span>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Người tiếp nhận:</span>
                    <span>{workOrder?.received_by || "Không có"}</span>
                  </div>
                  {workOrder?.estimated_completion && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Dự kiến hoàn thành:</span>
                      <span>{new Date(workOrder.estimated_completion).toLocaleDateString("vi-VN")}</span>
                    </div>
                  )} */}
                </div>
              </div>
              
              {/* Yêu cầu của khách hàng */}
              {workOrder?.customer_request && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Yêu cầu của khách hàng</h4>
                  <p className="text-gray-600">{workOrder.customer_request}</p>
                </div>
              )}
              
              {/* Tình trạng xe ban đầu */}
              {workOrder?.initial_condition && workOrder.initial_condition.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Tình trạng xe ban đầu</h4>
                  <div className="flex flex-wrap gap-2">
                    {workOrder.initial_condition.map((condition: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Hiển thị ảnh tình trạng xe ban đầu */}
                  {images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Ảnh tình trạng xe ban đầu:</h4>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {images.map((image) => (
                          <Card key={image.id} className="overflow-hidden">
                            <div className="aspect-square relative">
                              <Image 
                                src={image.data} 
                                alt={image.name} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <CardContent className="p-2">
                              <div className="text-xs truncate">{image.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {(image.size / 1024).toFixed(1)} KB
                              </div>
                              <div className="flex justify-end mt-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7" 
                                  onClick={() => viewImage(image.data)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Ghi chú admin */}
              {workOrder?.admin_notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Ghi chú của Admin</h4>
                  <p className="text-gray-600">{workOrder.admin_notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-green-600" />
              <span>Hình ảnh xe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser?.role === "ktv" ? (
              <ImageUpload 
                images={taskImages} 
                onImagesChange={setTaskImages} 
                maxImages={10} 
                label="Hình ảnh xe"
              />
            ) : (
              <div className="space-y-4">
                {taskImages && taskImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {taskImages.map((image, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <Image 
                            src={image.url} 
                            alt={`Hình ảnh ${index + 1}`} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <CardContent className="p-2">
                          <div className="flex justify-end mt-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={() => viewImage(image.url)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Chưa có hình ảnh nào</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Task Status */}
        {currentUser?.role === "ktv" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Cập nhật trạng thái</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Hạng mục sửa chữa */}
                <div>
                  <h3 className="text-base font-medium mb-3">Hạng mục sửa chữa</h3>
                  <div className="border rounded-md overflow-hidden">
                    <div className="md:block hidden"> {/* Phiên bản desktop/tablet */}
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left p-3 font-medium text-gray-700 w-1/2">HẠNG MỤC SỬA CHỮA</th>
                            <th className="text-left p-3 font-medium text-gray-700 w-1/2">YÊU CẦU CÔNG VIỆC</th>
                          </tr>
                        </thead>
                        <tbody>
                          {repairItems.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-3">
                                <Input 
                                  placeholder={item.item}
                                  onChange={(e) => {
                                    const newItems = [...repairItems];
                                    newItems[index].item = e.target.value;
                                    setRepairItems(newItems);
                                  }}
                                />
                              </td>
                              <td className="p-3">
                                <Input 
                                  placeholder={item.requirement}
                                  onChange={(e) => {
                                    const newItems = [...repairItems];
                                    newItems[index].requirement = e.target.value;
                                    setRepairItems(newItems);
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td className="p-3" colSpan={2}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  setRepairItems([...repairItems, { item: "", requirement: "" }]);
                                }}
                                type="button"
                              >
                                + Thêm hạng mục
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Phiên bản mobile */}
                    <div className="md:hidden block">
                      {repairItems.map((item, index) => (
                        <div key={index} className="border-b p-3">
                          <div className="mb-2">
                            <Label className="text-xs font-medium text-gray-700 mb-1 block">HẠNG MỤC SỬA CHỮA</Label>
                            <Input 
                              value={item.item}
                              onChange={(e) => {
                                const newItems = [...repairItems];
                                newItems[index].item = e.target.value;
                                setRepairItems(newItems);
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-700 mb-1 block">YÊU CẦU CÔNG VIỆC</Label>
                            <Input 
                              value={item.requirement}
                              onChange={(e) => {
                                const newItems = [...repairItems];
                                newItems[index].requirement = e.target.value;
                                setRepairItems(newItems);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="p-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setRepairItems([...repairItems, { item: "", requirement: "" }]);
                          }}
                          type="button"
                        >
                          + Thêm hạng mục
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

              

                <div>
                  <label className="text-sm font-medium">Trạng thái công việc</label>
                  <Select value={taskStatus} onValueChange={setTaskStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Ghi chú</label>
                  <Textarea
                    placeholder="Nhập ghi chú về công việc"
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 border-green-200">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <AlertDescription className="text-green-700">{success}</AlertDescription>
                    </div>
                  </Alert>
                )}

                <Button 
                  onClick={handleSaveTask} 
                  disabled={saving} 
                  className="w-full"
                >
                  {saving ? (
                    "Đang lưu..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </RoleLayout>
  )
}