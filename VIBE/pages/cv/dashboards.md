Tạo giao diện dashboard tổng quan dành cho vai trò **Cố vấn dịch vụ** trong hệ thống quản lý gara ô tô. Giao diện giống như ảnh tôi cung cấp, bao gồm các thành phần sau:

---

## 🎨 Bố cục tổng thể
- Layout chia 2 cột:
  - Sidebar bên trái
  - Phần nội dung chính bên phải
- Responsive: thiết kế ưu tiên tablet/mobile  trước, sau đó tối ưu cho desktop

---

## 📋 Sidebar (Menu bên trái)
- Logo app: "Gara Manager", dòng phụ: "Cố Vấn Dịch Vụ"
- Menu:
  - Dashboard (🏠 icon)
  - Khách hàng (👤 icon) (xem file `pages/customers/customers.md`)
  - Tạo phiếu tiếp nhận (📄 icon) (xem file `pages/order/order-create.md`)
- Dưới cùng:
  - Email người dùng: `cv@gara.com`
  - Nút Đăng xuất (🔓 icon + label)

---

## 📊 Nội dung chính

### A. Header
- Tiêu đề: **Dashboard Cố vấn dịch vụ**

### B. Tổng quan số lượng
- 4 ô thống kê:
  - **Chờ xử lý** (🕒 icon)
  - **Đang chuẩn đoán** (🚗 icon)
  - **Hoàn thành** (✅ icon)
- Mỗi ô:
  - Bo góc, có border, padding lớn
  - Có icon nhỏ và số đếm (VD: Tổng phiếu: 3)

---

### C. Thao tác nhanh (3 block)
- Mỗi block là 1 button lớn, có icon, label, và mô tả phụ
  - **Quản lý khách hàng** (👥)
    - Label phụ: “Xem danh sách và thông tin khách hàng”
  - **Tạo phiếu tiếp nhận** (➕)
    - Label phụ: “Tạo phiếu mới cho khách hàng”
- Màu sắc: mỗi block có màu nền riêng (xanh nhạt, xanh lá nhạt, tím nhạt)

---

### D. Phiếu tiếp nhận gần đây
- Danh sách các `OrderItem` (xem file `components/order-item.md`)
