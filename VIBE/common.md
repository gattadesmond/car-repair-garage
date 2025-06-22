## Ứng dụng quản lý garage/trung tâm dịch vụ ô tô

Car Repair Garage Mobile Web App (MVP)

### 📌 Mục tiêu dự án(Project Summary)

Phát triển **Mobile Web App** hỗ trợ cố vấn dịch vụ và kỹ thuật viên tại gara thực hiện các bước kiểm tra, chẩn đoán và lập báo giá sửa chữa xe **nhanh – chuẩn – tự tin**, bám sát quy trình thực tế tại gara.

Ứng dụng ưu tiên thiết kế **Mobile-first**, có thể đóng gói thành **Mobile App** dưới hình thức PWA.

---

### Luổng sử dụng

- **CV** đăng nhập -> Tạo phiếu tiếp nhận --> Chọn hoặc tạo mới khách hàng --> Chọn thông tin xe hoặc tạo mới -> Tạo Phiếu sửa chữa -> Hoàn thành
- **ADMIN** đăng nhập -> Tiếp nhận phiếu sửa chữa ->  Phân công Task cho từng KTV ->  Hoàn thành
- **KTV** đăng nhập -> Nhận task -> Kiểm tra xe -> Ghi note thông tin sửa chữa -> Xác nhận trạng thái sửa chữa

### Sitemap
- Xem mô tả ở file `sitemap.md`

### 📱 Giao diện & trải nghiệm

- Thiết kế **Mobile-first**, dễ dùng cho nhân viên gara sử dụng mobile hoặc tablet
- Dùng **Tailwind CSS + ShadCN UI**
- Tích hợp **PWA** để cài như mobile app

---

### 🧱 Yêu cầu kỹ thuật
Bản MVP sẽ chưa kết nối với hệ thống quản trị gara, sau khi hoàn thành MVP sẽ dùng API riêng để kết nối.

### ⚙️ Tính năng MVP (Giai đoạn 1) (Key Features)
#### Quyền cố vấn dịch vụ
- Đăng nhập website (xem file `pages/login.md`)
- Trang dashboard (xem file `pages/cv/dashboard.md`)
- Tạo một phiếu sửa chữa order (xem file `pages/order/order-create.md`)
- Dánh sách khách hàng và chi tiết khách hàng (xem file `pages/customer/`)
- Dánh sách khách hàng và chi tiết khách hàng (xem file `pages/customer/`)

