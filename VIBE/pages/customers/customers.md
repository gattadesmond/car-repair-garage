Tạo màn hình **Quản lý khách hàng** cho hệ thống sửa chữa ô tô (Garage Manager). Giao diện giống như ảnh tôi cung cấp, và gồm các thành phần sau:
Chỉ có quyền `ADMIN` và `CV` mới có thể xem được màn hình này.

## 🧭 Tổng quan UI

- Trang hiển thị danh sách khách hàng dạng card
- Mỗi card bao gồm:
  - Tên khách hàng (có label “Khách cũ” nếu là khách quay lại)
  - Số điện thoại 📞
  - Email 📧
  - Danh sách các xe của khách (biển số + tên xe + năm sản xuất)
  - Ngày sửa cuối cùng
  - Hai nút:
    - **Lịch sử** (icon đồng hồ + label), đi vào trang chi tiết khách hàng (xem file `pages/customers/customer-detail.md`)
    - **Tạo phiếu mới** (nút đen nổi bật) (xem file `pages/order/order-create.md`)

---

## 🔍 Phần tìm kiếm
- Ô input phía trên cùng:
  - Placeholder: `Tìm kiếm theo tên, SĐT, biển số...`
  - Full width
- Bên phải ô tìm kiếm là nút **“+ Thêm khách hàng”**
  - Kiểu: primary, đậm, biểu tượng ➕

---

## 📋 Mỗi khách hàng hiển thị:
Hiển thị chi tiết một khách hàng cùng với các phương tiện của họ, dùng để tra cứu nhanh và tạo phiếu sửa chữa mới.
- **Tên khách hàng**: `Nguyễn Văn An`
  - Badge bên cạnh: `Khách cũ` (nếu có lịch sử sửa chữa trước đây)

- **Thông tin liên hệ**:
  - 📞 `0901234567`
  - ✉️ `an.nguyen@email.com`

- **Xe của khách**:
  - 🚘 `51A-96695 – Toyota Camry (2020)`
  - 🚘 `51A-12345 – Honda Civic (2022)`
  - Các dòng xe được hiển thị theo danh sách, có thể bấm chọn (nếu có tương tác mở rộng)

- **Lần sửa cuối**:
  - 🕒 `15/11/2024`
- **Nút "Lịch sử"** (icon đồng hồ): xem lịch sử sửa chữa của khách hàng
- **Nút "Tạo phiếu mới"** (primary button): mở biểu mẫu tạo phiếu tiếp nhận cho khách này


## 🧠 Ghi chú thêm
- Danh sách khách hàng nên hỗ trợ scroll nếu dài
- Lưu ý spacing thoáng, font dễ đọc, màu sắc nhẹ
- Có thể cho label "Khách cũ" nằm trong badge (rounded-sm, border)

