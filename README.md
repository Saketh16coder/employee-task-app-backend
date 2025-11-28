### ProU Employee & Task Management – Backend (Node.js + SQLite)

This backend powers the ProU Employee–Task portal with user authentication, employee CRUD, task CRUD, SQLite storage, and Express routing.

### 🚀 Features

Express.js server

SQLite persistent database

User authentication API:

/api/auth/register

/api/auth/login

Employee CRUD API:

GET /api/employees

POST /api/employees

PUT /api/employees/:id

DELETE /api/employees/:id

Task CRUD API:

GET /api/tasks

POST /api/tasks

PUT /api/tasks/:id

DELETE /api/tasks/:id

Joins employee name when fetching tasks

Static frontend hosting

### Supports frontend routes:

/login

/signup

/dashboard

### 🗂️ Backend File Structure

backend/
│── database.sqlite
│── db.js
│── server.js
│── package.json
│── package-lock.json
│── README.md

### 📦 Install Dependencies

Run inside /backend folder:

```
npm install
```

### ▶️ Start Backend Server

```
npm run dev
```

Server starts on:
```
http://localhost:4000
```

### 🗃️ Database Schema
users

| id | name | email | password |

employees

| id | name | role | email |

tasks

| id | title | description | status | employee_id |

## 🔌 API Endpoints

### Auth

| Method | Route                | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Register a new user       |
| POST   | `/api/auth/login`    | Validate user credentials |

### EMPLOYEES

| Method | Route                | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/employees`     | Get all employees   |
| POST   | `/api/employees`     | Create new employee |
| PUT    | `/api/employees/:id` | Update employee     |
| DELETE | `/api/employees/:id` | Delete employee     |

### TASKS

| Method | Route            | Description                  |
| ------ | ---------------- | ---------------------------- |
| GET    | `/api/tasks`     | Get tasks with employee name |
| POST   | `/api/tasks`     | Create task                  |
| PUT    | `/api/tasks/:id` | Update task                  |
| DELETE | `/api/tasks/:id` | Delete task                  |

### 🌐 Frontend Routing Support

In server.js:

app.get("/", sendApp);
app.get("/login", sendApp);
app.get("/signup", sendApp);
app.get("/dashboard", sendApp);
app.get("*", sendApp);


This ensures React routing works properly.

📸 Screenshots

🔹 Create Employee

<img width="897" height="266" alt="image" src="https://github.com/user-attachments/assets/6c9f59b1-ff56-4c44-ac21-21219806b3c0" />

🔹 Create Task

<img width="1918" height="257" alt="image" src="https://github.com/user-attachments/assets/c1b086e2-de9a-4bb8-9780-a8f9661e690d" />

