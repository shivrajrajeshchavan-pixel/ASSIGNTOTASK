# 📚 AttendoTask (ASSIGNTOTASK)

A modern, full-stack Academic Assignment and Attendance Management portal built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**.

---

## 🌟 Overview

**AttendoTask** is an all-in-one institutional management system designed to streamline academic operations between administrators, faculty, and students. It replaces manual assignment submissions and paper attendance logs with a unified, role-secured digital workflow.

---

## ✨ Key Features by Role

### 🛡️ Admin Portal
- **Dashboard Metrics:** Real-time statistics on total students, faculty members, assignments, and attendance status.
- **Teacher Management:** Add, edit, and assign teachers to specific subjects and departments.
- **Student Directory:** Enroll students, assign roll numbers, semesters, and sections.

### 👨‍🏫 Teacher Portal
- **Assignment Creation:** Create subject-scoped coursework with detailed descriptions, attachments, and due dates.
- **Submission Grading:** Inspect student file uploads, award marks, and provide constructive feedback.
- **Attendance Monitoring:** Monitor student attendance percentages and automatically flag students with attendance shortages.

### 🎓 Student Portal
- **Coursework Feed:** View pending assignments, instructions, and upcoming submission deadlines.
- **Document Submissions:** Upload assignments (PDFs and documents) directly to faculty.
- **Attendance Tracker:** Real-time attendance percentage breakdown per subject with automatic threshold warnings (< 75%).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, Multer (File Uploads), CORS, Dotenv |
| **Database** | MongoDB with Mongoose ODM |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js password hashing, Role-Based Access Control (RBAC) |

---

## 📁 Project Structure

```text
assigntotask/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── api/                # Axios instance & API client modules
│   │   ├── context/            # AuthContext & State management
│   │   ├── pages/
│   │   │   ├── admin/          # Admin dashboard & management views
│   │   │   ├── teacher/        # Teacher assignment & grading views
│   │   │   ├── student/        # Student tasks & attendance views
│   │   │   └── Login.jsx       # Unified authentication portal
│   │   ├── App.jsx             # Route definitions & protected routes
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express.js REST API Backend
│   ├── controllers/            # Request handlers (auth, admin, assignments, etc.)
│   ├── middleware/             # JWT auth, role authorization, file upload rules
│   ├── models/                 # Mongoose schemas (User, Teacher, Student, etc.)
│   ├── routes/                 # Express API route definitions
│   ├── uploads/                # Local storage directory for file submissions
│   ├── seed.js                 # Database seeder with demo accounts
│   ├── server.js               # Application entry point & DB connection
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** (Local MongoDB instance or MongoDB Atlas connection string)
- **npm** or **yarn**

---

### 2. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `server/` with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/attendotask
   JWT_SECRET=your_jwt_secret_key_here
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. Seed the database with sample users and records:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`.

---

### 3. Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`.

---

## 🔑 Demo Login Credentials

You can test each role using the pre-seeded accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@college.com` | `Admin@123` | Full system control |
| **Teacher** | `teacher@college.com` | `Teacher@123` | Assignments & grading |
| **Student** | `student@college.com` | `Student@123` | Tasks & attendance tracking |

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/admin/stats` | Retrieve college-wide overview stats | Admin |
| `POST` | `/api/admin/teachers` | Register a new faculty member | Admin |
| `POST` | `/api/admin/students` | Enroll a new student | Admin |
| `GET` | `/api/assignments` | List assignments (scoped by role) | Authenticated |
| `POST` | `/api/assignments` | Create a new subject assignment | Teacher |
| `POST` | `/api/submissions/:id` | Submit coursework file | Student |
| `PATCH` | `/api/submissions/:id/grade` | Grade submission & provide feedback | Teacher |
| `GET` | `/api/attendance/my` | View student attendance stats | Student |

---

## 📄 License
This project is licensed under the ISC License.
