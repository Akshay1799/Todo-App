# TodoApp — Full-Stack Task Manager

A full-stack todo/task management application with authentication, priority levels, search, and filtering. Built with React + Vite on the frontend and Node.js + Express on the backend, connected to MongoDB Atlas.

Live Demo: [Link](https://todo-app-three-ochre-14.vercel.app)

---

## Features

### Authentication
- User signup & login with JWT-based authentication
- Secure HTTP-only cookies + Authorization header support
- Forgot password & reset password via email token
- Password hashing with bcrypt

### Todo Management
- Create todos with title, description, and priority
- Inline edit todos (title, description, priority)
- Toggle complete / active status with optimistic UI updates
- Delete todos with instant UI feedback
- Priority levels — **High**, **Medium**, **Low** with colour-coded badges

### UI / UX
- Real-time debounced search
- Filter tabs — **All**, **Active**, **Completed**
- Server-side pagination (8 todos per page)
- Full dark mode support
- Fully responsive layout
- Optimistic UI updates for instant feedback

---

## Tech Stack

### Frontend (`client/`)
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Axios | HTTP client |
| React Icons | Icon library |

### Backend (`server/`)
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| cookie-parser | Cookie handling |
| nodemailer | Email (password reset) |
| dotenv | Environment config |

### Infrastructure
| Service | Platform |
|---|---|
| Frontend hosting | [Vercel](https://vercel.com) |
| Backend hosting | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) |

---

## Local Development Setup

### Prerequisites
- Node.js v18+
- A [MongoDB Atlas](https://cloud.mongodb.com) account and cluster

### 1. Clone the Repository
```bash
git clone https://github.com/Akshay1799/Todo-App.git
cd Todo-App
```

### 2. Setup the Server
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todos

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
RESET_PASSWORD_URL=http://localhost:5173/reset-password
```

Start the server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup the Client
```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000
```

Start the client:
```bash
npm run dev
# Client runs on http://localhost:5173
```

---

## API Reference

### Base URL
```
https://todo-app-s2pg.onrender.com
```

### Auth Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|---|
| `POST` | `/api/auth/signup` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login & receive JWT token |
| `POST` | `/api/auth/logout` | No | Clear auth cookie |
| `GET`  | `/api/auth/me` | Yes | Get current user profile |
| `POST` | `/api/auth/forgot-password` | No | Send password reset email |
| `PATCH`| `/api/auth/reset-password/:token` | No | Reset password with token |

### Todo Endpoints

All todo routes require authentication via `Authorization: Bearer <token>` header or `token` cookie.

| Method | Endpoint | Description |
|--------|----------|---|
| `GET` | `/api/todos` | Get all todos (supports `?page`, `?limit`, `?q`, `?completed`) |
| `POST` | `/api/todos` | Create a new todo |
| `GET` | `/api/todos/:id` | Get a single todo by ID |
| `PATCH` | `/api/todos/:id` | Update a todo |
| `DELETE` | `/api/todos/:id` | Delete a todo |
| `PATCH` | `/api/todos/:id/toggle` | Toggle completed status |


**Render Environment Variables:**
```env
NODE_ENV=production
MONGO_URI=<your Atlas URI>
JWT_SECRET=<strong random secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your Vercel URL>
RESET_PASSWORD_URL=<your Vercel URL>/reset-password
```

## Author

**Akshay** — [GitHub @Akshay1799](https://github.com/Akshay1799)