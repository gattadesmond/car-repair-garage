// Script để kiểm tra xem hình ảnh đã được hiển thị chưa

// Danh sách các work order cần kiểm tra
const workOrderIds = [
  'work-order-1',
  'work-order-2',
  'work-order-3',
  'work-order-4',
  'work-order-5'
];

function verifyImagesDisplayed() {
  // Đợi một chút để đảm bảo trang đã tải xong
  setTimeout(() => {
    // Kiểm tra xem có phần tử hình ảnh nào không
    const imageElements = document.querySelectorAll('img');
    const imageCards = document.querySelectorAll('.aspect-square');
    
    console.log('Số lượng phần tử hình ảnh trên trang:', imageElements.length);
    console.log('Số lượng card hình ảnh trên trang:', imageCards.length);
    
    // Kiểm tra xem đang ở trang chi tiết work order nào
    const currentPath = window.location.pathname;
    const currentWorkOrderMatch = currentPath.match(/\/work-orders\/(work-order-\d+)/);
    
    if (currentWorkOrderMatch) {
      const currentWorkOrderId = currentWorkOrderMatch[1];
      verifyWorkOrderImages(currentWorkOrderId, imageElements.length, imageCards.length);
    } else {
      // Nếu không ở trang chi tiết work order, kiểm tra tất cả
      verifyAllWorkOrderImages();
    }
  }, 2000);
}

function verifyWorkOrderImages(workOrderId, imageElementsCount, imageCardsCount) {
  const imageKey = `images-${workOrderId}`;
  const storedImages = localStorage.getItem(imageKey);
  
  if (storedImages) {
    try {
      const parsedImages = JSON.parse(storedImages);
      console.log(`Dữ liệu hình ảnh trong localStorage cho ${workOrderId}:`, parsedImages);
      
      // Hiển thị thông báo trên trang
      showVerificationMessage({
        workOrderId: workOrderId,
        storedImagesCount: parsedImages.length,
        imageElementsCount: imageElementsCount,
        imageCardsCount: imageCardsCount
      });
    } catch (error) {
      console.error(`Lỗi khi phân tích dữ liệu hình ảnh cho ${workOrderId}:`, error);
    }
  } else {
    console.log(`Không tìm thấy dữ liệu hình ảnh cho ${workOrderId}`);
    showVerificationMessage({
      workOrderId: workOrderId,
      storedImagesCount: 0,
      imageElementsCount: imageElementsCount,
      imageCardsCount: imageCardsCount
    });
  }
}

function verifyAllWorkOrderImages() {
  let totalStoredImages = 0;
  let workOrdersWithImages = 0;
  
  workOrderIds.forEach(workOrderId => {
    const imageKey = `images-${workOrderId}`;
    const storedImages = localStorage.getItem(imageKey);
    
    if (storedImages) {
      try {
        const parsedImages = JSON.parse(storedImages);
        totalStoredImages += parsedImages.length;
        workOrdersWithImages++;
      } catch (error) {
        console.error(`Lỗi khi phân tích dữ liệu hình ảnh cho ${workOrderId}:`, error);
      }
    }
  });
  
  // Hiển thị thông báo tổng hợp
  const messageDiv = document.createElement('div');
  messageDiv.style.position = 'fixed';
  messageDiv.style.bottom = '10px';
  messageDiv.style.right = '10px';
  messageDiv.style.backgroundColor = '#4CAF50';
  messageDiv.style.color = 'white';
  messageDiv.style.padding = '10px';
  messageDiv.style.borderRadius = '5px';
  messageDiv.style.zIndex = '9999';
  messageDiv.style.maxWidth = '300px';
  messageDiv.innerHTML = `<strong>Kiểm tra hình ảnh:</strong><br>
    - Số work order có hình ảnh: ${workOrdersWithImages}/${workOrderIds.length}<br>
    - Tổng số hình ảnh đã lưu: ${totalStoredImages}`;
  
  // document.body.appendChild(messageDiv);
}

function showVerificationMessage({ workOrderId, storedImagesCount, imageElementsCount, imageCardsCount }) {
  const messageDiv = document.createElement('div');
  messageDiv.style.position = 'fixed';
  messageDiv.style.bottom = '10px';
  messageDiv.style.right = '10px';
  messageDiv.style.backgroundColor = storedImagesCount > 0 ? '#4CAF50' : '#F44336';
  messageDiv.style.color = 'white';
  messageDiv.style.padding = '10px';
  messageDiv.style.borderRadius = '5px';
  messageDiv.style.zIndex = '9999';
  messageDiv.style.maxWidth = '300px';
  messageDiv.innerHTML = `<strong>Kiểm tra hình ảnh cho ${workOrderId}:</strong><br>
    - Hình ảnh trong localStorage: ${storedImagesCount}<br>
    - Phần tử hình ảnh trên trang: ${imageElementsCount}<br>
    - Card hình ảnh: ${imageCardsCount}`;
  
  document.body.appendChild(messageDiv);
}

// Thực thi khi trang được tải
if (typeof window !== 'undefined') {
  // Đảm bảo DOM đã được tải
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verifyImagesDisplayed);
  } else {
    verifyImagesDisplayed();
  }
}