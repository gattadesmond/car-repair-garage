// Script để thêm hình ảnh demo cho work-order-4

// Kiểm tra xem đã có dữ liệu hình ảnh cho work-order-4 chưa
function addDemoImagesForWorkOrder4() {
  const imageKey = 'images-work-order-4';
  
  // Chỉ thêm nếu chưa có dữ liệu
  if (!localStorage.getItem(imageKey)) {
    // Tạo URL cho hình ảnh demo
    const imagePath = '/images/car-background.jpg';
    
    // Tạo một Image object để lấy kích thước thực của hình ảnh
    const img = new Image();
    img.onload = function() {
      // Tạo canvas để chuyển đổi hình ảnh thành base64
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Chuyển đổi hình ảnh thành base64
      const base64Image = canvas.toDataURL('image/jpeg');
      
      // Tạo dữ liệu hình ảnh demo
      const demoImages = [
        {
          id: 'img-1',
          name: 'Ảnh mặt trước xe.jpg',
          type: 'upload',
          data: base64Image,
          size: Math.round(base64Image.length * 0.75) // Ước tính kích thước
        },
        {
          id: 'img-2',
          name: 'Ảnh động cơ.jpg',
          type: 'camera',
          data: base64Image,
          size: Math.round(base64Image.length * 0.75) // Ước tính kích thước
        }
      ];
      
      // Lưu vào localStorage
      localStorage.setItem(imageKey, JSON.stringify(demoImages));
      console.log('Đã thêm hình ảnh demo cho work-order-4');
      
      // Nếu đang ở trang work-order-4, reload để hiển thị hình ảnh
      if (window.location.pathname.includes('/work-orders/work-order-4')) {
        window.location.reload();
      }
    };
    
    // Bắt đầu tải hình ảnh
    img.src = imagePath;
  }
}

// Thực thi khi trang được tải
if (typeof window !== 'undefined') {
  // Đảm bảo DOM đã được tải
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDemoImagesForWorkOrder4);
  } else {
    addDemoImagesForWorkOrder4();
  }
}