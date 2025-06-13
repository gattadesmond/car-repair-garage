"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, X, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageFile {
  id: string
  file: File
  url: string
  type: "camera" | "upload"
}

interface ImageUploadProps {
  images: ImageFile[]
  onImagesChange: (images: ImageFile[]) => void
  maxImages?: number
  label?: string
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  label = "Ảnh hiện trạng xe",
}: ImageUploadProps) {
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null, type: "camera" | "upload") => {
    if (!files) return

    setError("")
    const newImages: ImageFile[] = []

    // Kiểm tra số lượng ảnh
    if (images.length + files.length > maxImages) {
      setError(`Chỉ được phép tối đa ${maxImages} ảnh`)
      return
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Kiểm tra định dạng file
      if (!file.type.startsWith("image/")) {
        setError("Chỉ được phép upload file ảnh")
        continue
      }

      // Kiểm tra kích thước file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 5MB")
        continue
      }

      const imageFile: ImageFile = {
        id: `${type}-${Date.now()}-${i}`,
        file,
        url: URL.createObjectURL(file),
        type,
      }

      newImages.push(imageFile)
    }

    onImagesChange([...images, ...newImages])
  }

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id)
    onImagesChange(updatedImages)

    // Cleanup URL
    const imageToRemove = images.find((img) => img.id === id)
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url)
    }
  }

  const viewImage = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {/* Upload Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCameraCapture}
          disabled={images.length >= maxImages}
        >
          <Camera className="h-4 w-4 mr-2" />
          Chụp ảnh
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFileUpload}
          disabled={images.length >= maxImages}
        >
          <Upload className="h-4 w-4 mr-2" />
          Tải ảnh lên
        </Button>

        <span className="text-sm text-gray-500 self-center">
          ({images.length}/{maxImages} ảnh)
        </span>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, "camera")}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, "upload")}
      />

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="relative">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt="Ảnh hiện trạng xe"
                    className="w-full h-full object-cover rounded"
                  />

                  {/* Action Buttons */}
                  <div className="absolute top-1 right-1 flex space-x-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => viewImage(image.url)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute bottom-1 left-1">
                    <span className="text-xs bg-black bg-opacity-50 text-white px-1 rounded">
                      {image.type === "camera" ? "📷" : "📁"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-1 truncate">{image.file.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Chụp ảnh các vị trí hư hỏng, vết xước, móp méo</p>
        <p>• Chụp ảnh tổng thể xe từ 4 góc</p>
        <p>• Định dạng: JPG, PNG. Tối đa 5MB/ảnh</p>
        <p>• Tối đa {maxImages} ảnh</p>
      </div>
    </div>
  )
}
