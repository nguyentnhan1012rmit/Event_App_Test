# 📅 Event Management App

Ứng dụng quản lý sự kiện hiện đại được xây dựng với MERN Stack: **MongoDB, Express, React, Node.js**.  
Hỗ trợ người dùng đăng ký, đăng nhập (kể cả bằng Google), tạo sự kiện, đặt vé và quản trị qua dashboard chuyên nghiệp.

---

## 🚀 Cách chạy ứng dụng

### 1. Cài đặt thư viện

#### Ở thư mục gốc (frontend):
```bash
npm install
```

#### Ở thư mục `server` (backend):
```bash
cd server
npm install
```

---

### 2. Chạy ứng dụng

#### Mở 2 terminal song song:

🔹 **Terminal 1 – Backend**:
```bash
cd server
node server.js
```
Chạy tại: `http://localhost:5000`

🔹 **Terminal 2 – Frontend**:
```bash
npm run dev
```
Chạy tại: `http://localhost:5173`

---

## 🧩 Cách thêm Trang (Page)

1. Tạo file mới trong thư mục `src/pages`, ví dụ:
```jsx
// Contact.jsx
export default function Contact() {
  return <h1>Trang Liên hệ</h1>;
}
```

2. Thêm route trong `App.jsx`:
```jsx
import Contact from './pages/Contact';

<Routes>
  <Route path="/contact" element={<Contact />} />
</Routes>
```

---

## 🔐 Thiết lập file `.env`

Tạo file `.env` trong thư mục `server/` với nội dung:

```
MONGO_URI=mongodb://localhost:27017/eventDB
JWT_SECRET=chuoi_bi_mat_bat_ky
```

📌 File `.env` đã được thêm vào `.gitignore`, không bị đẩy lên GitHub.

---

## 📦 Thêm API mới (Backend)

1. Tạo file mới trong `server/routes/`, ví dụ `event.js`

2. Viết route trong đó:
```js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Sự kiện đang hoạt động');
});

export default router;
```

3. Kết nối trong `server.js`:
```js
import eventRoutes from './routes/event.js';
app.use('/api/events', eventRoutes);
```

---

## 📁 Cấu trúc thư mục

```
event_management_app/
├── server/                # Backend Express
│   ├── models/            # Mongoose Models
│   ├── routes/            # API Routes
│   ├── .env               # Biến môi trường backend
│   └── server.js          # Điểm vào backend
│
├── src/                   # Frontend React
│   ├── pages/             # Các trang (Auth, Dashboard,...)
│   ├── assets/            # Hình ảnh, svg,...
│   ├── App.jsx            # Gốc ứng dụng React
│   └── main.jsx
│
├── .env                   # (nếu có biến môi trường frontend)
├── .gitignore
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## 🧠 Công nghệ sử dụng

| Công nghệ       | Mục đích                  |
|----------------|---------------------------|
| React + Vite   | Frontend nhanh, hiện đại  |
| Tailwind CSS   | Giao diện UI linh hoạt    |
| Express.js     | Backend API               |
| MongoDB        | Cơ sở dữ liệu             |
| JWT            | Xác thực người dùng       |
| @react-oauth/google | Đăng nhập bằng Google |

---
