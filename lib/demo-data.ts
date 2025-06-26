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

export interface RepairTask {
  id: string
  name: string
  description?: string
  service_type: string
  status?: "pending" | "in_progress" | "completed"
  assigned_technician?: string
  created_at: string
  updated_at: string
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
  selected_services?: string[]
  repair_tasks?: RepairTask[]
  notes?: string
  admin_notes?: string
  received_by: string
  received_date: string
  status: "pending" | "diagnosis"  | "completed" 
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
      }
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
  }
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
    customer_request: "Xe không khởi động được, đèn báo động cơ sáng",
    initial_condition: ["Không khởi động", "Đèn check engine sáng"],
    diagnosis_symptoms: ["Ắc quy yếu", "Lỗi cảm biến oxy"],
    notes: "Khách hàng cần xe gấp",
    received_by: "",
    received_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    status: "diagnosis",
    assigned_technician: "tech-1",
    repair_tasks: [
      {
        id: "task-1-1",
        name: "Sửa chữa hệ thống điện",
        description: "Thay thế ắc quy cũ bằng ắc quy mới chính hãng, thay cảm biến oxy bị lỗi và cài đặt lại hệ thống",
        service_type: "electrical",
        status: "pending",
        assigned_technician: "tech-3",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        id: "task-1-2",
        name: "Vệ sinh khoang động cơ",
        description: "Vệ sinh toàn bộ khoang động cơ, kiểm tra các kết nối điện",
        service_type: "cleaning",
        status: "pending",
        assigned_technician: "tech-1",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 43200000).toISOString(),
      }
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "work-order-2",
    customer_id: "customer-2",
    car_id: "car-3",
    customer_name: "Trần Thị Bình",
    car_info: "Honda City (2019)",
    license_plate: "52B-12345",
    customer_request: "Bảo dưỡng định kỳ 30,000 km",
    initial_condition: ["Xe hoạt động bình thường", "Đèn báo bảo dưỡng sáng"],
    diagnosis_symptoms: ["Dầu động cơ cần thay", "Lọc gió bẩn"],
    notes: "Khách hàng yêu cầu kiểm tra toàn bộ hệ thống",
    received_by: "",
    received_date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    status: "completed",
    assigned_technician: "tech-2",
    repair_tasks: [
      {
        id: "task-2-1",
        name: "Bảo dưỡng hệ thống cơ khí",
        description: "Thay dầu động cơ và lọc dầu mới, thay lọc gió động cơ mới, kiểm tra hệ thống phanh và điều chỉnh nếu cần",
        service_type: "mechanical",
        status: "completed",
        assigned_technician: "tech-2",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "task-2-2",
        name: "Vệ sinh nội thất",
        description: "Vệ sinh toàn bộ nội thất xe",
        service_type: "cleaning",
        status: "completed",
        assigned_technician: "tech-1",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
    estimated_completion: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "work-order-3",
    customer_id: "customer-1",
    car_id: "car-1",
    customer_name: "Nguyễn Văn An",
    car_info: "Toyota Camry (2020)",
    license_plate: "51A-96695",
    customer_request: "Thay nhớt hộp số, kiểm tra hệ thống lái",
    initial_condition: ["Xe hoạt động bình thường", "Vô lăng rung nhẹ khi đi tốc độ cao"],
    diagnosis_symptoms: ["Nhớt hộp số cần thay", "Bánh xe cần cân bằng động"],
    notes: "Khách hàng yêu cầu kiểm tra toàn bộ hệ thống lái",
    received_by: "",
    received_date: new Date(Date.now() - 518400000).toISOString().split("T")[0],
    status: "completed",
    assigned_technician: "tech-4",
    estimated_completion: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "work-order-4",
    customer_id: "customer-2",
    car_id: "car-3",
    customer_name: "Trần Thị Bình",
    car_info: "Honda City (2019)",
    license_plate: "52B-12345",
    customer_request: "Thay dây đai cam, kiểm tra hệ thống làm mát",
    initial_condition: ["Động cơ kêu lạ", "Nhiệt độ động cơ cao"],
    diagnosis_symptoms: ["Dây đai cam mòn", "Bơm nước yếu"],
    notes: "Khách hàng yêu cầu kiểm tra toàn bộ hệ thống làm mát",
    received_by: "",
    received_date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
    status: "diagnosis",
    assigned_technician: "tech-5",
    estimated_completion: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "work-order-5",
    customer_id: "customer-1",
    car_id: "car-1",
    customer_name: "Nguyễn Văn An",
    car_info: "Toyota Camry (2020)",
    license_plate: "51A-96695",
    customer_request: "Thay bình ắc quy, kiểm tra hệ thống điện",
    initial_condition: ["Xe khó khởi động", "Đèn pha mờ"],
    diagnosis_symptoms: ["Ắc quy yếu", "Máy phát điện có vấn đề"],
    notes: "Khách hàng yêu cầu sử dụng ắc quy chính hãng",
    received_by: "",
    received_date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    status: "diagnosis",
    assigned_technician: "tech-3",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  }
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
  }
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

export const getDemoData = () => {
  return {
    customers: getCustomers(),
    workOrders: getWorkOrders(),
    technicians: getTechnicians()
  }
}
