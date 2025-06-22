# 👤 CustomerDetailPage – Trang chi tiết khách hàng
Trang này dùng để xem thông tin cá nhân, danh sách xe và lịch sử sửa chữa của một khách hàng cụ thể trong garage.
Chỉ có quyền `ADMIN` và `CV` mới có thể xem được màn hình này.

---

## 🧾 1. Thông tin khách hàng

Hiển thị ở đầu trang:

- **Họ tên**: Nguyễn Văn An  
- **SĐT**: 0901234567  
- **Email**: an.nguyen@email.com  
- **Địa chỉ**: 123 Đường ABC, Quận 1, TP.HCM  
- **Lần sửa cuối**: 🕒 15/11/2024  

---

## 🚘 2. Danh sách xe

Hiển thị theo tab hoặc filter, mặc định là `Tất cả xe`. Mỗi xe bao gồm:

### Xe 1
- **Biển số**: 51A-96695  
- **Hãng**: Toyota  
- **Model**: Camry  
- **Năm SX**: 2020  
- **Màu**: Trắng  
- **Số khung**: FE659

### Xe 2
- **Biển số**: 51A-12345  
- **Hãng**: Honda  
- **Model**: Civic  
- **Năm SX**: 2022  
- **Màu**: Đen  
- **Số khung**: HN123

---

## 🛠 3. Lịch sử sửa chữa

Hiển thị danh sách các phiếu sửa chữa (repair orders), mỗi item là 1 `OrderItem`


## 🔘 4. Hành động

- Nút `Quay lại` (góc trên bên trái)  
- Nút `Tạo phiếu mới` (góc trên bên phải)  
