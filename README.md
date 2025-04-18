# 📅 EVEMA – Event Management App

EVEMA is a modern full-stack event management web application. It allows users to authenticate (including via Google), create and manage events, book tickets, and access a professional admin dashboard.

---

## ✨ Features

- 🔐 User authentication via email and Google OAuth
- 🗓️ Create, edit, and delete events
- 🎫 Book and manage tickets
- 📊 Admin dashboard with event overviews
- 📱 Responsive design using Tailwind CSS
- ⚙️ RESTful API services built with Express.js

---

## 🚀 How to Run the Application

### 1. Install Dependencies

#### In the frontend directory:
```bash
npm install
```

#### In the backend (`server`) directory:
```bash
cd server
npm install
```

---

### 2. Start the App

#### Open two terminals:

🔹 **Terminal 1 – Backend**:
```bash
cd server
node server.js
```
Runs on: `http://localhost:5001`

🔹 **Terminal 2 – Frontend**:
```bash
npm run dev
```
Runs on: `http://localhost:5173`

---

## 🧩 Adding a New Page (Frontend)

1. Create a new file in `src/pages`, for example:
```jsx
// Contact.jsx
export default function Contact() {
  return <h1>Contact Page</h1>;
}
```

2. Add the route in `App.jsx`:
```jsx
import Contact from './pages/Contact';

<Routes>
  <Route path="/contact" element={<Contact />} />
</Routes>
```

---

## 📦 Adding a New API Endpoint (Backend)

1. Create a file in `server/routes/`, for example `event.js`:
```js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Event route active');
});

export default router;
```

2. Connect it in `server.js`:
```js
import eventRoutes from './routes/event.js';
app.use('/api/events', eventRoutes);
```

---

## 📁 Folder Structure

```
evema/
├── server/                # Backend (Express)
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── .env               # Backend environment variables
│   └── server.js          # Backend entry point
│
├── src/                   # Frontend (React)
│   ├── pages/             # Page components (Auth, Dashboard, etc.)
│   ├── assets/            # Static files, images, icons
│   ├── App.jsx            # Main app component
│   └── main.jsx
│
├── .env                   # Frontend environment variables (optional)
├── .gitignore
├── README.md
├── tailwind.config.js
└── vite.config.js
```

---

## 👥 Team Contributions

| Member              | Student ID | Role               | Contributions                             |
|---------------------|------------|--------------------|-------------------------------------------|
| Nguyen Thanh Nhan   | s4073629   | Frontend Developer | Authentication UI, Tailwind layout        |
| Nguyen Huu Quoc Huy | s3986423   | Backend Developer  | Event & booking APIs, MongoDB integration |
| Le Anh Minh         | s4044176   | Fullstack Engineer | Integration, dashboard, deployment        |


---

## 🧠 Technologies Used

| Technology             | Purpose                                |
|------------------------|----------------------------------------|
| React + Vite           | Fast and modern frontend development   |
| Tailwind CSS           | Utility-first CSS framework            |
| Node.js + Express.js   | Backend and API management             |
| MongoDB + Mongoose     | Database and ODM                       |
| JWT                    | Authentication and token handling      |
| @react-oauth/google    | Google OAuth integration               |
