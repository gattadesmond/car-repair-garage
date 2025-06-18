// Demo data for the application
export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  cars: Car[]
  last_service?: string
}

export interface Car {
  id: string
  customer_id: string
  license_plate: string
  brand: string
  model: string
  year: number
  vin_number?: string
  color?: string
}

export interface WorkOrder {
  id: string
  customer_id: string
  car_id: string
  customer_name: string
  car_info: string
  license_plate: string
  customer_request: string
  initial_condition: string[]
  diagnosis_symptoms: string[]
  notes?: string
  admin_notes?: string
  received_by: string
  received_date: string
  status: "pending" | "diagnosis" | "in_inspection" | "completed" | "delivered"
  assigned_technician?: string
  estimated_completion?: string
  created_at: string
  updated_at: string
}

export interface Technician {
  id: string
  full_name: string
  email: string
  role: string
}

// Demo customers data
export const demoCustomers: Customer[] = [
  {
    id: "customer-1",
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "an.nguyen@email.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    last_service: "2024-11-15",
    cars: [
      {
        id: "car-1",
        customer_id: "customer-1",
        license_plate: "51A-96695",
        brand: "toyota",
        model: "camry",
        year: 2020,
        vin_number: "FE659",
        color: "Trắng",
      },
      {
        id: "car-2",
        customer_id: "customer-1",
        license_plate: "51A-12345",
        brand: "honda",
        model: "civic",
        year: 2022,
        vin_number: "HN123",
        color: "Đen",
      },
    ],
  },
  {
    id: "customer-2",
    name: "Trần Thị Bình",
    phone: "0912345678",
    email: "binh.tran@email.com",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    last_service: "2024-10-20",
    cars: [
      {
        id: "car-3",
        customer_id: "customer-2",
        license_plate: "52B-12345",
        brand: "honda",
        model: "city",
        year: 2019,
        vin_number: "AB123",
        color: "Đen",
      },
    ],
  },
  {
    id: "customer-3",
    name: "Lê Văn Cường",
    phone: "0923456789",
    email: "cuong.le@email.com",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    cars: [
      {
        id: "car-4",
        customer_id: "customer-3",
        license_plate: "53C-67890",
        brand: "mazda",
        model: "cx-5",
        year: 2021,
        vin_number: "CD456",
        color: "Xám",
      },
    ],
  },
]

// Demo work orders
export const demoWorkOrders: WorkOrder[] = [
  {
    id: "work-order-1",
    customer_id: "customer-1",
    car_id: "car-1",
    customer_name: "Nguyễn Văn An",
    car_info: "Toyota Camry (2020)",
    license_plate: "51A-96695",
    customer_request: "Thay ống bao dưỡng, thay nẹp, thay nhựa lưng ghế",
    initial_condition: ["Vết xước nhỏ", "Hư hỏng gương"],
    diagnosis_symptoms: ["Tiếng ồn bất thường", "Rung lắc"],
    notes: "Bọc nắp gương bàn giao",
    received_by: "HAISAN",
    received_date: new Date().toISOString().split("T")[0],
    status: "pending",
    assigned_technician: "tech-5",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "work-order-2",
    customer_id: "customer-2",
    car_id: "car-3",
    customer_name: "Trần Thị Bình",
    car_info: "Honda City (2019)",
    license_plate: "52B-12345",
    customer_request: "Đánh phấn vô zin, chèn lò xo vào học gương",
    initial_condition: ["Vết xước sâu", "Móp méo"],
    diagnosis_symptoms: ["Hệ thống điện có vấn đề"],
    notes: "Cần kiểm tra hệ thống điện",
    received_by: "HAISAN",
    received_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    status: "diagnosis",
    assigned_technician: "tech-1",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "work-order-3",
    customer_id: "customer-3",
    car_id: "car-4",
    customer_name: "Lê Văn Cường",
    car_info: "Mazda CX-5 (2021)",
    license_plate: "53C-67890",
    customer_request: "Bảo dưỡng định kỳ, thay dầu máy",
    initial_condition: ["Lốp mòn"],
    diagnosis_symptoms: ["Động cơ có tiếng lạ"],
    notes: "Khách yêu cầu sử dụng dầu cao cấp",
    received_by: "HAISAN",
    received_date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    status: "in_inspection",
    assigned_technician: "tech-2",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  // Work order 4 đã bị xóa theo yêu cầu
  {
    id: "work-order-5",
    customer_id: "customer-2",
    car_id: "car-3",
    customer_name: "Trần Thị Bình",
    car_info: "Honda City (2019)",
    license_plate: "52B-12345",
    customer_request: "Thay thế hệ thống phanh, kiểm tra hệ thống treo",
    initial_condition: ["Phanh kêu", "Xe rung lắc khi đi đường xấu"],
    diagnosis_symptoms: ["Má phanh mòn", "Giảm xóc hỏng"],
    notes: "Khách hàng yêu cầu sử dụng phụ tùng chính hãng",
    received_by: "HAISAN",
    received_date: new Date(Date.now() - 345600000).toISOString().split("T")[0],
    status: "in_inspection",
    assigned_technician: "tech-2",
    estimated_completion: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "work-order-6",
    customer_id: "customer-3",
    car_id: "car-4",
    customer_name: "Lê Văn Cường",
    car_info: "Mazda CX-5 (2021)",
    license_plate: "53C-67890",
    customer_request: "Sửa chữa hệ thống điều hòa, thay lọc gió điều hòa",
    initial_condition: ["Điều hòa không mát", "Có mùi hôi khi bật điều hòa"],
    diagnosis_symptoms: ["Gas điều hòa thiếu", "Lọc gió điều hòa bẩn"],
    notes: "Khách hàng yêu cầu vệ sinh toàn bộ hệ thống điều hòa",
    received_by: "HAISAN",
    received_date: new Date(Date.now() - 432000000).toISOString().split("T")[0],
    status: "completed",
    assigned_technician: "tech-3",
    estimated_completion: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "work-order-7",
    customer_id: "customer-1",
    car_id: "car-1",
    customer_name: "Nguyễn Văn An",
    car_info: "Toyota Camry (2020)",
    license_plate: "51A-96695",
    customer_request: "Thay nhớt hộp số, kiểm tra hệ thống lái",
    initial_condition: ["Xe hoạt động bình thường", "Vô lăng rung nhẹ khi đi tốc độ cao"],
    diagnosis_symptoms: ["Nhớt hộp số cần thay", "Bánh xe cần cân bằng động"],
    notes: "Khách hàng yêu cầu kiểm tra toàn bộ hệ thống lái",
    received_by: "HAISAN",
    received_date: new Date(Date.now() - 518400000).toISOString().split("T")[0],
    status: "completed",
    assigned_technician: "tech-4",
    estimated_completion: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "work-order-8",
    customer_id: "customer-2",
    car_id: "car-3",
    customer_name: "Trần Thị Bình",
    car_info: "Honda City (2019)",
    license_plate: "52B-12345",
    customer_request: "Thay dây đai cam, kiểm tra hệ thống làm mát",
    initial_condition: ["Động cơ kêu lạ", "Nhiệt độ động cơ cao"],
    diagnosis_symptoms: ["Dây đai cam mòn", "Bơm nước yếu"],
    notes: "Khách hàng yêu cầu kiểm tra toàn bộ hệ thống làm mát",
    received_by: "HAISAN",
    received_date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
    status: "in_inspection",
    assigned_technician: "tech-5",
    estimated_completion: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "work-order-9",
    customer_id: "customer-3",
    car_id: "car-4",
    customer_name: "Lê Văn Cường",
    car_info: "Mazda CX-5 (2021)",
    license_plate: "53C-67890",
    customer_request: "Thay bình ắc quy, kiểm tra hệ thống điện",
    initial_condition: ["Xe khó khởi động", "Đèn pha mờ"],
    diagnosis_symptoms: ["Ắc quy yếu", "Máy phát điện có vấn đề"],
    notes: "Khách hàng yêu cầu sử dụng ắc quy chính hãng",
    received_by: "HAISAN",
    received_date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    status: "diagnosis",
    assigned_technician: "tech-3",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "work-order-10",
    customer_id: "customer-1",
    car_id: "car-2",
    customer_name: "Nguyễn Văn An",
    car_info: "Honda Civic (2022)",
    license_plate: "51A-12345",
    customer_request: "Thay lốp xe, cân chỉnh thước lái",
    initial_condition: ["Lốp mòn không đều", "Xe bị lệch khi đi thẳng"],
    diagnosis_symptoms: ["Lốp cần thay", "Thước lái lệch"],
    notes: "Khách hàng yêu cầu sử dụng lốp Michelin",
    received_by: "HAISAN",
    received_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    status: "pending",
    assigned_technician: "tech-1",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

// Demo technicians
export const demoTechnicians: Technician[] = [
  {
    id: "tech-1",
    full_name: "Nguyễn Văn Tài",
    email: "tai.nguyen@gara.com",
    role: "ktv",
  },
  {
    id: "tech-2",
    full_name: "Trần Minh Đức",
    email: "duc.tran@gara.com",
    role: "ktv",
  },
  {
    id: "tech-3",
    full_name: "Lê Hoàng Nam",
    email: "nam.le@gara.com",
    role: "ktv",
  },
  {
    id: "tech-4",
    full_name: "Phạm Thanh Sơn",
    email: "son.pham@gara.com",
    role: "ktv",
  },
  {
    id: "tech-5",
    full_name: "Võ Minh Tuấn",
    email: "tuan.vo@gara.com",
    role: "ktv",
  },
]

// Helper functions for demo data
export const getCustomers = (): Customer[] => {
  if (typeof window === "undefined") return demoCustomers

  const stored = localStorage.getItem("demo-customers")
  return stored ? JSON.parse(stored) : demoCustomers
}

export const saveCustomers = (customers: Customer[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("demo-customers", JSON.stringify(customers))
}

export const getWorkOrders = (): WorkOrder[] => {
  if (typeof window === "undefined") return demoWorkOrders

  const stored = localStorage.getItem("demo-work-orders")
  return stored ? JSON.parse(stored) : demoWorkOrders
}

export const saveWorkOrders = (workOrders: WorkOrder[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("demo-work-orders", JSON.stringify(workOrders))
}

export const getTechnicians = (): Technician[] => {
  return demoTechnicians
}

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("user")
  return stored ? JSON.parse(stored) : null
}
