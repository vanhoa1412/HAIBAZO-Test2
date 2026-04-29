# 📚 Book Review System (Bài 2 - Fullstack)

Hệ thống quản lý và đánh giá sách toàn diện được xây dựng với kiến trúc Fullstack hiện đại.

## 🔗 Link Sản Phẩm
- **Live Demo (Frontend)**: [https://haibazo-test2.vercel.app/](https://haibazo-test2.vercel.app/)
- **API Endpoint (Backend)**: [https://haibazo-test2.onrender.com/](https://haibazo-test2.onrender.com/)

## 🚀 Công Nghệ Sử Dụng

### Frontend
- **ReactJS**: Quản lý giao diện và trạng thái ứng dụng.
- **Vite**: Công cụ build hiệu năng cao.
- **CSS-in-JS**: Thiết kế giao diện hiện đại, responsive.

### Backend
- **Spring Boot**: Xây dựng RESTful API mạnh mẽ.
- **Spring Data JPA**: Quản lý dữ liệu và tương tác database.
- **PostgreSQL**: Cơ sở dữ liệu quan hệ chính tin cậy.

### Hạ tầng (Cloud)
- **Supabase**: Lưu trữ Database PostgreSQL đám mây.
- **Render**: Triển khai Backend (Spring Boot qua Docker).
- **Vercel**: Triển khai Frontend (React).

## ✨ Tính Năng Chính
- **Quản lý Sách**: Xem danh sách sách, thông tin chi tiết từng cuốn.
- **Quản lý Tác giả**: Thông tin về các tác giả trong hệ thống.
- **Hệ thống Đánh giá**: Người dùng có thể xem và để lại đánh giá cho các cuốn sách.
- **Phân trang (Pagination)**: Tối ưu hiệu năng khi hiển thị danh sách lớn.
- **Cấu hình Linh hoạt**: Sử dụng biến môi trường (Environment Variables) cho Production.

## 🛠 Hướng dẫn Cài đặt Local

1. **Backend**:
   - Di chuyển vào thư mục `springboot`.
   - Cấu hình database trong `application.properties`.
   - Chạy lệnh: `./mvnw spring-boot:run`.

2. **Frontend**:
   - Di chuyển vào thư mục `frontend`.
   - Chạy lệnh: `npm install` và `npm run dev`.

---
*Dự án được phát triển bởi **vanhoa1412** cho kỳ thực tập tại HAIBAZO.*
