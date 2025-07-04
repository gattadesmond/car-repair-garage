import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff'
}

export const metadata: Metadata = {
  title: 'Garage Sửa Chữa Ô Tô - Hệ thống quản lý dịch vụ chuyên nghiệp',
  description: 'Hệ thống quản lý garage sửa chữa ô tô chuyên nghiệp với đầy đủ tính năng cho kỹ thuật viên, chuyên viên và quản trị viên',
  generator: 'v0.dev',
  keywords: ['garage ô tô', 'sửa chữa xe hơi', 'quản lý garage', 'dịch vụ ô tô', 'bảo dưỡng xe', 'chẩn đoán xe'],
  authors: [{ name: 'Car Repair Garage Team' }],
  creator: 'Car Repair Garage',
  publisher: 'Car Repair Garage',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  openGraph: {
    title: 'Garage Sửa Chữa Ô Tô - Hệ thống quản lý dịch vụ chuyên nghiệp',
    description: 'Hệ thống quản lý garage sửa chữa ô tô chuyên nghiệp với đầy đủ tính năng cho kỹ thuật viên, chuyên viên và quản trị viên',
    url: 'https://carrepairgarage.com',
    siteName: 'Garage Sửa Chữa Ô Tô',
    images: [
      {
        url: '/images/og-image.jpg', // Bạn cần tạo file ảnh này trong thư mục public/images
        width: 1200,
        height: 630,
        alt: 'Garage Sửa Chữa Ô Tô Preview',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garage Sửa Chữa Ô Tô - Hệ thống quản lý dịch vụ chuyên nghiệp',
    description: 'Hệ thống quản lý garage sửa chữa ô tô chuyên nghiệp',
    images: ['/images/twitter-image.jpg'], // Bạn cần tạo file ảnh này trong thư mục public/images
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png', // Bạn cần tạo file icon này trong thư mục public
    shortcut: '/shortcut-icon.png', // Bạn cần tạo file icon này trong thư mục public
  },
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <head>
        <script src="/js/demo-images-all.js" defer></script>
        <script src="/js/check-images.js" defer></script>
        <script src="/js/verify-images.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
