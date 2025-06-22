# 📦 Component: TaskItem

## 🎯 Mục tiêu
Hiển thị một nhiệm vụ cần thực hiện thuộc 1 đơn hàng `OrderItem`.
Mỗi task sẽ thuộc 1 trong 5 nhóm là : `Dọn Dẹp`, `Đồng sơn`, `Cơ`, `Điện`, `Lạnh`

## 🖼️ Giao diện
- Khung bo góc nhẹ, có bóng đổ nhẹ.
- Label thể hiện nhóm công việc được giao : `Dọn Dẹp`, `Đồng sơn`, `Cơ`, `Điện`, `Lạnh`
- Trái: icon loại công việc (ví dụ: sửa phanh, thay dầu...)
- Giữa: tên công việc, mã công việc, ghi chú ngắn (nếu có)
- Phải: nút “Chi tiết” hoặc "Nhận việc"

## 🖼️ UI
## 🏷 Nhóm dịch vụ
- **Tag nhóm**: `Dọn Dẹp` (hiển thị như badge)

## 🧹 Tên công việc
- Ví dụ: `Vệ sinh khoang động cơ`, `Vệ sinh dàn lạnh`, `Vệ sinh nội thất`

## 📄 Trạng thái công việc
- **Trạng thái**:
  - `Chưa phân công` (badge xám) - Khi chưa được phân `KTV`
  - `Đang chờ` (badge xám) - Khi `ADMIN` hoặc `CV` đã phân công `KTV`
  - `Hoàn thành` (badge xanh đậm) - Khi `KTV` đã hoàn thành ghi nhận

## 🚘 Thông tin xe & khách hàng
- **Biển số xe**: VD: `51A-96695`
- **Loại xe + năm sản xuất**: VD: `Toyota Camry (2020)`
- **Khách hàng**: VD: `Nguyễn Văn An`, `Trần Thị Bình`

## 📝 Mô tả công việc
- VD:
  - `Vệ sinh toàn bộ khoang động cơ, kiểm tra các kết nối điện`
  - `Vệ sinh toàn bộ dàn lạnh, lọc gió điều hòa`
  - `Vệ sinh toàn bộ nội thất xe`

## 📆 Thời gian
- **Giờ tạo**: VD: `21h 21/6/2025`

## 🔘 Hành động
- **Button**: `Xem chi tiết` – để truy cập nội dung chi tiết task