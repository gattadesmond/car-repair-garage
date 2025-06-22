# 📦 Component: OrderItem
Đơn sửa chữa

## 🎯 Mục tiêu
Hiển thị một đơn hàng được tạo ra từ `CV` hoặc `ADMIN`
Mỗi `OrderItem` đại diện cho một xe đang trong quá trình tiếp nhận  tại garage.
1 `OrderItem` có thể nhiều hơn 1 task, TaskItem (xem file `components/task-item.md`)
`OrderItem` có 2 trạng thái là `Hủy` ,`Đang chuẩn đoán` và `Hoàn thành`, vừa tạo sẽ là trang thái `Đang chuẩn đoán`, khi các `TaskItem` được hoàn thành thì `OrderItem` sẽ chuyển sang trạng thái `Hoàn thành`.
`OrderItem` có thể bị hủy bởi `CV` hoặc `ADMIN`

## 🖼️ Giao diện
- Khung bo góc nhẹ, có bóng đổ nhẹ.
- Trái: tên công việc, mã công việc, ghi chú ngắn (nếu có)
- Phải: nút “Chi tiết”

## 📌 Thông tin chính
- **Xe**: `Toyota Camry (2020) – 51A-96695`
- **Trạng thái**: `Đang chuẩn đoán` (hiển thị dưới dạng badge màu xanh dương nhạt) và `Hoàn thành` (hiển thị dưới dạng badge màu xanh lá)
- **Ngày tiếp nhận**: `21/6/2025`
- **Người tiếp nhận**: hiển thị icon 👤, nếu có thể thêm tên cố vấn

## 📝 Nội dung
- **Tên khách hàng**: Nguyễn Văn An / Trần Thị Bình
- **Yêu cầu của khách hàng** : Xe không khởi động được, đèn báo động cơ sáng

### Button
- `Chi tiết`: vào trang chi tiết đơn của `OrderItem`

### Danh sách task
- Hiển thị danh sách `TaskItem` được tạo ra từ `OrderItem` (xem file `components/task-item.md`)
- Title : Công việc sửa chữa
- **Status**: 
  - `Đang chờ` (màu vàng)
  - `Đang chuẩn đoán` (màu xanh dương)
  - `Hoàn thành` (Màu xanh lá)
- Mỗi `TaskItem` có thể có 1 trong 3 trạng thái: `Đang chờ`, `Đang chuẩn đoán`, `Hoàn thành`
- Mỗi `TaskItem` có thể có 1 trong 2 nút thao tác: `Phân công KTV`, `Xem chi tiết`
- **KTV phụ trách**: (hiện tại có thể là `Chưa phân công`)



