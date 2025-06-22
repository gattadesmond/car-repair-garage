📁 /
├── 📁 api/
│   ├── auth/
│   ├── repair-orders/
│   └── ...
│
├── 📁 (auth)/                         # Nhóm trang xác thực
│   ├── login/
│   └── forgot-password/
│
├── 📁 (dashboard)/                   # Group route chính sau đăng nhập

│   ├── 📁 cv/                        # Cố vấn dịch vụ
│   │   ├── dashboard/               # Tổng quan
│   │   ├── customers/               # Tạo + quản lý khách hàng (tạo/edit trong modal)
│   │   ├── vehicles/                # Quản lý xe (gộp luôn vào trang intake-form nếu muốn)
│   │   ├── intake-forms/            # Tạo + xem phiếu tiếp nhận
│   │   │   └── [id]/                # Xem chi tiết phiếu
│   │   ├── symptoms-picker/         # Giao diện chọn triệu chứng (có thể nhúng)
│   │   ├── repair-orders/           # Quản lý lệnh sửa chữa: tabs (Đã tạo, Đang thực hiện, Đã hoàn tất)
│   │   │   └── [id]/                # Chi tiết từng lệnh
│   │   ├── quotations/              # Báo giá: tabs (Tất cả, Đã xuất, Đang chờ)
│   │   │   └── [id]/pdf             # Báo giá dạng PDF
│   │   └── reports/summary/         # Báo cáo tổng hợp
│
│   ├── 📁 ktv/                       # Kỹ thuật viên
│   │   ├── tasks/                   # Danh sách lệnh sửa chữa (tabs: Có thể nhận, Đang làm)
│   │   │   └── [id]/                # Chi tiết công việc
│   │   └── repair-notes/            # Ghi chú kỹ thuật / checklist
│
│   ├── 📁 manager/                  # Quản lý
│   │   ├── dashboard/
│   │   ├── users/                   # Quản lý người dùng, phân quyền
│   │   ├── pricing-config/          # Cấu hình bảng giá
│   │   ├── reports/                 # Tabs: theo ngày, tháng, người dùng
│   │   └── activity-log/            # Nhật ký hệ thống
│
│   ├── 📁 settings/                 # Cài đặt chung
│   │   ├── profile/
│   │   ├── preferences/
│   │   └── logout/
│
│   └── layout.tsx                   # Layout dùng chung dashboard
│
├── 📁 components/                   # Component tái sử dụng
│   ├── ui/
│   ├── layout/
│   ├── form/
│   └── repair/
│
├── 📁 lib/
│   ├── api/
│   ├── auth/
│   └── utils.ts
│
├── 📁 constants/
│   ├── roles.ts
│   ├── symptom-tree.ts
│   └── repair-status.ts
│
├── 📁 types/
│   ├── user.ts
│   ├── vehicle.ts
│   └── repair-order.ts
│
├── middleware.ts
├── layout.tsx
├── tailwind.config.ts
└── globals.css
