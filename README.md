# TaskFlow – Smart Todo App with Sync & Stats

A full-stack todo application built with React, Express, and MongoDB featuring drag-and-drop, LocalStorage sync, and a statistics dashboard.

## Features

- ✅ Add/edit/delete tasks with due dates
- 🎯 Drag & drop task reordering (react-beautiful-dnd)
- 💾 LocalStorage + backend sync (Express + MongoDB)
- 📊 Stats dashboard (tasks completed per day with data visualization)
- 🎨 Clean, modern UI with Tailwind CSS v4.1

## Tech Stack

- **Frontend**: Vite + React + Tailwind CSS v4.1
- **Backend**: Express + MongoDB
- **Styling**: Tailwind CSS v4.1
- **Drag & Drop**: react-beautiful-dnd

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

### Installation

1. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

3. **Set Up Environment Variables**
   - Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   ```
   Create `.env` file with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=taskflow
   ```
   - For MongoDB Atlas, use your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
   ```
   - Make sure MongoDB is running locally or you have a MongoDB Atlas account

4. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

5. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

6. **Open Your Browser**
   Navigate to `http://localhost:3000` to use the application

## Project Structure

```
taskflow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── StatsDashboard.jsx
│   │   ├── utils/
│   │   │   └── storage.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── tasks.js
│   ├── server.js
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/sync` - Sync all tasks (bulk operation)

## Features in Detail

### LocalStorage Sync
Tasks are automatically saved to LocalStorage and synced with the backend when available. If the backend is unavailable, the app continues to work offline using LocalStorage.

### Drag & Drop
Tasks can be reordered by dragging them. The order is persisted both in LocalStorage and the backend.

### Statistics Dashboard
View comprehensive statistics including:
- Total, completed, pending, and overdue task counts
- Completion rate percentage
- Daily completion chart for the last 30 days
- Productivity insights

## License

MIT

