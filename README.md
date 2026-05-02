# 🚀 Team Task Manager

A full-stack web application to manage projects, assign tasks, and track progress with role-based access control (Admin & Member).

---

## 📌 Features

* 🔐 Authentication (Signup/Login using JWT)
* 👤 Role-based access (Admin / Member)
* 📁 Project creation & team management
* ✅ Task creation, assignment, and status tracking
* 📊 Dashboard with task insights (pending, completed, overdue)
* 🔒 Secure password hashing using bcrypt

---

## 🧱 Tech Stack

**Frontend**

* React (Vite)
* Axios
* React Router

**Backend**

* Node.js
* Express.js
* MySQL (Railway)

**Other**

* JWT Authentication
* REST APIs

---

## 📂 Project Structure

```
team-task-manager/
│
├── backend/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create `.env` file inside backend:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=team_task_manager
JWT_SECRET=your_secret
PORT=3000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

### Backend (Railway)

* Deploy backend folder
* Add environment variables in Railway dashboard
* Connect to Railway MySQL

### Frontend (Vercel / Netlify)

* Deploy frontend folder
* Set API URL:

```
VITE_API_URL=https://your-backend-url/api
```

---

## 🔑 How It Works

* First registered user becomes **Admin**
* Admin can:

  * Create projects
  * Assign tasks
* Members can:

  * View assigned tasks
  * Update task status

---

## 📸 Demo Flow

1. Signup (Admin created automatically)
2. Login
3. Create project
4. Add members
5. Assign tasks
6. Members update task status
7. View dashboard analytics

---

## ⚠️ Important Notes

* Do not commit `.env` file
* Use Railway variables for production
* Ensure correct API base URL in frontend

---

## 📌 Future Improvements

* Email verification (OTP)
* Notifications system
* File attachments in tasks
* Real-time updates (WebSockets)

---

## 👨‍💻 Author

Mani
B.Tech CSE Student

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
