// Script để thêm hình ảnh demo cho tất cả các work order

// Danh sách các work order cần thêm hình ảnh
const workOrderIds = [
  'work-order-1',
  'work-order-2',
  'work-order-3',
  'work-order-4',
  'work-order-5'
];

// Hàm thêm hình ảnh demo cho một work order cụ thể
function addDemoImagesForWorkOrder(workOrderId) {
  const imageKey = `images-${workOrderId}`;
  
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
      
      // Tạo dữ liệu hình ảnh demo - tên hình ảnh sẽ khác nhau tùy theo work order
      const demoImages = [
        {
          id: `${workOrderId}-img-1`,
          name: `Ảnh mặt trước xe - ${workOrderId}.jpg`,
          type: 'upload',
          data: base64Image,
          size: Math.round(base64Image.length * 0.75) // Ước tính kích thước
        },
        {
          id: `${workOrderId}-img-2`,
          name: `Ảnh động cơ - ${workOrderId}.jpg`,
          type: 'camera',
          data: base64Image,
          size: Math.round(base64Image.length * 0.75) // Ước tính kích thước
        }
      ];
      
      // Lưu vào localStorage
      localStorage.setItem(imageKey, JSON.stringify(demoImages));
      console.log(`Đã thêm hình ảnh demo cho ${workOrderId}`);
      
      // Nếu đang ở trang của work order này, reload để hiển thị hình ảnh
      if (window.location.pathname.includes(`/work-orders/${workOrderId}`)) {
        window.location.reload();
      }
    };
    
    // Bắt đầu tải hình ảnh
    img.src = imagePath;
  }
}

// Thêm hình ảnh cho tất cả các work order
function addDemoImagesForAllWorkOrders() {
  workOrderIds.forEach(workOrderId => {
    addDemoImagesForWorkOrder(workOrderId);
  });
}

// Thực thi khi trang được tải
if (typeof window !== 'undefined') {
  // Đảm bảo DOM đã được tải
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDemoImagesForAllWorkOrders);
  } else {
    addDemoImagesForAllWorkOrders();
  }
}