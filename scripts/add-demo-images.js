// Script để thêm hình ảnh demo cho work-order-4
const fs = require('fs');
const path = require('path');

// Đường dẫn đến hình ảnh demo
const imagePath = path.join(__dirname, '..', 'public', 'images', 'car-background.jpg');

// Đọc hình ảnh và chuyển đổi thành base64
fs.readFile(imagePath, (err, data) => {
  if (err) {
    console.error('Error reading image file:', err);
    return;
  }
  
  // Chuyển đổi hình ảnh thành base64
  const base64Image = `data:image/jpeg;base64,${data.toString('base64')}`;
  
  // Tạo dữ liệu hình ảnh demo
  const demoImages = [
    {
      id: 'img-1',
      name: 'Ảnh mặt trước xe.jpg',
      type: 'upload',
      data: base64Image,
      size: data.length
    },
    {
      id: 'img-2',
      name: 'Ảnh động cơ.jpg',
      type: 'camera',
      data: base64Image,
      size: data.length
    }
  ];
  
  // Lưu vào localStorage (chỉ hoạt động trong trình duyệt)
  console.log('Demo images created. To add these images to localStorage, run the following code in your browser console:');
  console.log(`localStorage.setItem('images-work-order-4', '${JSON.stringify(demoImages).replace(/'/g, "\\'")}')`); 
  console.log('\nOr use this data to manually add to your application:')
  console.log(JSON.stringify(demoImages, null, 2));
});