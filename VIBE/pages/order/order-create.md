# 📦 Component: OrderCreate
Tạo phiếu sữa chữa là biểu mẫu dùng để ghi nhận thông tin khách hàng, xe và yêu cầu sửa chữa trước khi phân công kỹ thuật viên thực hiện.
Chỉ có quyền `ADMIN` và `CV` mới có thể xem được màn hình này.

## 🎯 Mục tiêu
Tạo phiếu sữa chữa, là tạo ra một `OrderItem` (xem file `components/order-item.md`)
Phiếu sửa chữa `OrderItem` có thể được tạo ra bởi `CV` hoặc `ADMIN`.

## 🖼️ Giao diện
- Khung bo góc nhẹ, có bóng đổ nhẹ.
- Dưới: nút “Tạo phiếu tiếp nhận” và "Hủy"

## 📋 1. Thông tin khách hàng
Nếu là khách hàng cũ, thì có thể chọn ở trang `Customer` (xem file `pages/customer.md`).
- Tên khách hàng (input, required)
- Số điện thoại (input, required)
- Email (input, optional)

## 🚗 2. Thông tin xe
Nếu là khách hàng cũ, thì có thể chọn các xe đã đăng ký ở `Customer` (xem file `pages/customer.md`). Còn không có thì sẽ ghi nhận xe mới.
- Biển số xe (required)
- Số khung VIN (optional)
- Hãng xe (dropdown)
- Dòng xe (dropdown phụ thuộc vào hãng)
- Năm sản xuất (dropdown)

## 🧰 3. Thông tin dịch vụ
- Textarea: "Yêu cầu của khách hàng" (required)
- Checkbox nhóm “Tình trạng ban đầu” gồm:
  - Đèn cảnh báo sáng
  - Đèn check
  - Đèn máy
  - Rửa kính không tốt
  - DVD/CD không tốt
  - Bảo hiểm không tốt
  - Tay ga cứng tay
  - Chìa bị hỏng tay
  - Cốp xe hỏng/móp
  - Gập gương không tốt
  - Nắp bình dầu rách
  - Logo (trước & sau) đủ
  - Còi bấm không tốt
  - Còi bụp không tốt
  - Chụp măng cá đủ
  - Kích chân gió bị trơn
  - Bảo sơn kém trơn xe


## 🔍 4. Triệu chứng phát hiện
- Tiêu đề: “Chọn triệu chứng”
- Có 3 tab:
  - Sửa chữa chung
  - Đồng sơn
  - Dọn xe
- Mỗi tab chứa danh sách triệu chứng theo dạng cây phân cấp (accordion nhiều cấp), có thể tick checkbox
- Có ô tìm kiếm “Tìm kiếm triệu chứng…”
- Nội dung triệu chứng được mô tả ở file `trieuchung.json`

## 📝 5. Ghi chú thêm
- Textarea: “Ghi chú thêm”

## 6. 🧾 Chia loại dịch vụ
- Các loại chính:
  - `Dọn Dẹp`, `Đồng Sơn`, `Cơ`, `Điện`, `Lạnh`
- Hiển thị theo dạng checkbox có icon, UI cần làm nổi bật
- Cho phép chọn nhiều loại dịch vụ
- Ứng với mỗi dịch vụ được chọn, sẽ tạo ra 1 task tương ứng (xem file `components/task-item.md`).

## 📸 7. Hình ảnh xe
- Phần upload ảnh, cho phép:
  - Chụp ảnh
  - Tải ảnh lên
  - Hiển thị (0/10 ảnh)
- Chú thích:
  - Chụp ảnh vị trí hư hỏng, vết xước, móp méo
  - Ảnh tổng thể 4 góc
  - JPG, PNG, ≤5MB, tối đa 10 ảnh

## 8. 🔘 Button thao tác

- `Tạo phiếu tiếp nhận`: Gửi form
- `Huỷ`: Thoát khỏi form

