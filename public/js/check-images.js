// Script để kiểm tra xem có dữ liệu hình ảnh cho tất cả các work order không

// Danh sách các work order cần kiểm tra
const workOrderIds = [
  'work-order-1',
  'work-order-2',
  'work-order-3',
  'work-order-4',
  'work-order-5'
];

// Kiểm tra localStorage cho một work order cụ thể
function checkImagesForWorkOrder(workOrderId) {
  const imageKey = `images-${workOrderId}`;
  const storedImages = localStorage.getItem(imageKey);
  
  if (storedImages) {
    try {
      const parsedImages = JSON.parse(storedImages);
      console.log(`Đã tìm thấy dữ liệu hình ảnh cho ${workOrderId}:`, parsedImages);
      return true;
    } catch (error) {
      console.error(`Lỗi khi phân tích dữ liệu hình ảnh cho ${workOrderId}:`, error);
    }
  } else {
    console.log(`Không tìm thấy dữ liệu hình ảnh cho ${workOrderId}`);
  }
  
  return false;
}

// Hiển thị thông báo trên trang
function showMessage(message, isSuccess = true) {
  const messageDiv = document.createElement('div');
  messageDiv.style.position = 'fixed';
  messageDiv.style.top = '10px';
  messageDiv.style.right = '10px';
  messageDiv.style.backgroundColor = isSuccess ? '#4CAF50' : '#F44336';
  messageDiv.style.color = 'white';
  messageDiv.style.padding = '10px';
  messageDiv.style.borderRadius = '5px';
  messageDiv.style.zIndex = '9999';
  messageDiv.textContent = message;
  
  document.body.appendChild(messageDiv);
  
  // Tự động ẩn thông báo sau 5 giây
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Kiểm tra hình ảnh cho tất cả các work order
function checkImagesForAllWorkOrders() {
  let foundCount = 0;
  let missingCount = 0;
  
  workOrderIds.forEach(workOrderId => {
    if (checkImagesForWorkOrder(workOrderId)) {
      foundCount++;
    } else {
      missingCount++;
    }
  });
  
  // Hiển thị thông báo tổng hợp
  if (foundCount > 0) {
    showMessage(`Đã tìm thấy hình ảnh cho ${foundCount} work order. Còn thiếu ${missingCount} work order.`, true);
  } else {
    showMessage(`Không tìm thấy hình ảnh cho tất cả ${workOrderIds.length} work order.`, false);
  }
  
  // Kiểm tra xem có đang ở trang chi tiết work order nào không
  const currentPath = window.location.pathname;
  const currentWorkOrderMatch = currentPath.match(/\/work-orders\/(work-order-\d+)/);
  
  if (currentWorkOrderMatch) {
    const currentWorkOrderId = currentWorkOrderMatch[1];
    // Nếu đang ở trang chi tiết work order và không có hình ảnh, tải lại trang sau 2 giây
    if (!checkImagesForWorkOrder(currentWorkOrderId)) {
      showMessage(`Đang tải lại trang để hiển thị hình ảnh cho ${currentWorkOrderId}...`, true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }
}

// Thực thi khi trang được tải
if (typeof window !== 'undefined') {
  // Đảm bảo DOM đã được tải
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkImagesForAllWorkOrders);
  } else {
    checkImagesForAllWorkOrders();
  }
}