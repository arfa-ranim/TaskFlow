# TaskFlow - How It Works & Testing Guide

## 🏗️ Project Architecture

### Backend (Express + MongoDB)
```
backend/
├── server.js          # Main Express server
├── config/
│   └── database.js    # MongoDB connection handler
├── models/
│   └── Task.js        # Task data model with CRUD operations
└── routes/
    └── tasks.js       # API endpoints for task operations
```

**How Backend Works:**
1. Server starts on port 5000
2. Connects to MongoDB database
3. Exposes REST API endpoints:
   - `GET /api/tasks` - Fetch all tasks
   - `POST /api/tasks` - Create new task
   - `PUT /api/tasks/:id` - Update task
   - `DELETE /api/tasks/:id` - Delete task
   - `POST /api/tasks/sync` - Bulk sync operations

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── App.jsx              # Main app component (state management)
│   ├── components/
│   │   ├── TaskForm.jsx     # Form to add new tasks
│   │   ├── TaskList.jsx     # List container with drag & drop
│   │   ├── TaskItem.jsx     # Individual task card
│   │   └── StatsDashboard.jsx # Statistics visualization
│   └── utils/
│       └── storage.js       # LocalStorage + API sync logic
```

**How Frontend Works:**
1. App loads → Tries to fetch tasks from backend
2. If backend fails → Falls back to LocalStorage
3. All operations sync to both LocalStorage AND backend
4. Optimistic UI updates (UI updates immediately, syncs in background)

## 🔄 Data Flow

### Adding a Task:
```
User fills form → TaskForm.jsx
  ↓
handleAddTask() in App.jsx
  ↓
1. Creates task with temp ID
2. Updates UI immediately (optimistic)
3. Saves to LocalStorage
4. Tries to create on backend via API
5. Updates task with backend ID if successful
```

### Syncing:
```
Every operation (add/edit/delete) →
  1. Updates React state (immediate UI update)
  2. Saves to LocalStorage (persistent storage)
  3. Syncs to backend API (cloud storage)
  
If backend is offline → App continues with LocalStorage
When backend comes back → Tasks sync automatically on next load
```

## 🧪 How to Test

### Prerequisites Setup

1. **Install Dependencies:**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

2. **Set Up MongoDB:**
   
   **Option A: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Default connection: `mongodb://localhost:27017`
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create free account at mongodb.com/atlas
   - Create a cluster
   - Get connection string
   - Update `backend/.env`:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
     ```

3. **Create Environment File:**
   ```bash
   cd backend
   # Create .env file with:
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=taskflow
   ```

### Step-by-Step Testing

#### Test 1: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
**Expected Output:**
```
✅ Connected to MongoDB successfully
🚀 Server is running on port 5000
📍 API available at http://localhost:5000/api
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
  VITE v7.2.2  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Open Browser:** Navigate to `http://localhost:3000`

---

#### Test 2: Add Tasks

1. **Fill the form:**
   - Enter task title: "Complete project documentation"
   - Add description: "Write comprehensive docs"
   - Set due date: Tomorrow's date
   - Click "➕ Add Task"

2. **Expected Result:**
   - Task appears immediately in "Active Tasks" section
   - Task is saved to LocalStorage
   - Task is synced to MongoDB backend
   - Check browser console (F12) - should see "Tasks synced with backend successfully"

3. **Add 3-4 more tasks** with different:
   - Titles
   - Descriptions (some with, some without)
   - Due dates (some past dates to test overdue)

---

#### Test 3: Drag & Drop Reordering

1. **Drag a task:**
   - Click and hold on any active task
   - Drag it up or down
   - Release to drop

2. **Expected Result:**
   - Task moves to new position
   - Order is saved to LocalStorage
   - Order is synced to backend
   - Order persists after page refresh

---

#### Test 4: Edit Tasks

1. **Click "✏️ Edit" button** on any task
2. **Modify:**
   - Change title
   - Update description
   - Change due date
3. **Click "Save"**

**Expected Result:**
- Changes appear immediately
- Changes saved to LocalStorage
- Changes synced to backend
- Changes persist after refresh

---

#### Test 5: Complete Tasks

1. **Click the checkbox** on an active task
2. **Expected Result:**
   - Task moves to "Completed Tasks" section
   - Checkbox is checked
   - Task shows completion timestamp
   - Stats dashboard updates

---

#### Test 6: Delete Tasks

1. **Click "🗑️ Delete" button** on any task
2. **Expected Result:**
   - Task disappears immediately
   - Removed from LocalStorage
   - Removed from backend
   - Task doesn't reappear after refresh

---

#### Test 7: Statistics Dashboard

1. **Click "Show Stats" button**
2. **Expected Result:**
   - See summary cards:
     - Total Tasks count
     - Completed count
     - Pending count
     - Overdue count
   - See completion rate bar
   - See 30-day completion chart (bar graph)
   - See productivity insights

3. **Complete a few tasks** and check stats update

---

#### Test 8: Offline Functionality

1. **Stop the backend server** (Ctrl+C in backend terminal)
2. **Add a new task** in the frontend
3. **Expected Result:**
   - Task still appears (works with LocalStorage)
   - Console shows error about backend, but app continues
4. **Restart backend server**
5. **Refresh the page**
6. **Expected Result:**
   - Task syncs to backend automatically
   - All tasks load from backend

---

#### Test 9: Data Persistence

1. **Add several tasks**
2. **Close the browser completely**
3. **Reopen browser and navigate to app**
4. **Expected Result:**
   - All tasks are still there
   - Tasks load from backend (if available) or LocalStorage

---

#### Test 10: API Endpoints (Optional - Using Browser or Postman)

**Test Backend API directly:**

1. **Health Check:**
   ```
   GET http://localhost:5000/api/health
   ```
   Expected: `{ "status": "OK", "message": "TaskFlow API is running" }`

2. **Get All Tasks:**
   ```
   GET http://localhost:5000/api/tasks
   ```
   Expected: Array of all tasks

3. **Create Task:**
   ```
   POST http://localhost:5000/api/tasks
   Content-Type: application/json
   
   {
     "title": "API Test Task",
     "description": "Created via API",
     "dueDate": "2024-12-31",
     "completed": false
   }
   ```
   Expected: Created task with MongoDB _id

4. **Update Task:**
   ```
   PUT http://localhost:5000/api/tasks/{taskId}
   Content-Type: application/json
   
   {
     "completed": true
   }
   ```
   Expected: Updated task

5. **Delete Task:**
   ```
   DELETE http://localhost:5000/api/tasks/{taskId}
   ```
   Expected: `{ "message": "Task deleted successfully" }`

---

## 🐛 Troubleshooting

### Backend won't start:
- **Check MongoDB is running:** `mongod` or check MongoDB service
- **Check .env file exists** in backend directory
- **Check port 5000 is available**

### Frontend won't start:
- **Check Node.js version:** Should be v16+
- **Delete node_modules and reinstall:**
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Tasks not syncing:
- **Check browser console** for errors
- **Check backend is running** and accessible
- **Check CORS** - backend should allow frontend origin
- **Check MongoDB connection** in backend logs

### Drag & Drop not working:
- **Check react-beautiful-dnd is installed**
- **Check browser console** for errors
- **Try different browser** (Chrome/Firefox recommended)

---

## 📊 What to Look For

### Successful Test Indicators:

✅ **UI Updates Immediately** - No lag when adding/editing tasks
✅ **Data Persists** - Tasks survive page refresh
✅ **Backend Sync Works** - Console shows sync success messages
✅ **Offline Mode Works** - App functions without backend
✅ **Stats Update** - Dashboard reflects current task state
✅ **Drag & Drop Smooth** - Tasks reorder smoothly
✅ **No Console Errors** - Clean browser console (except expected network errors when backend is down)

### Performance Checks:

- Tasks load in < 1 second
- Adding task is instant (optimistic UI)
- Drag & drop is smooth (60fps)
- Stats dashboard renders quickly

---

## 🎯 Testing Checklist

- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Can add tasks with all fields
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Can complete tasks
- [ ] Drag & drop works
- [ ] Stats dashboard shows correct data
- [ ] Tasks persist after refresh
- [ ] Offline mode works
- [ ] Backend sync works
- [ ] Overdue tasks are highlighted
- [ ] Completion chart shows data

---

## 🚀 Quick Test Script

Run this in your browser console (F12) after loading the app:

```javascript
// Test LocalStorage
console.log('LocalStorage tasks:', JSON.parse(localStorage.getItem('taskflow_tasks')));

// Test API connection
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(data => console.log('Backend status:', data))
  .catch(err => console.log('Backend offline:', err));
```

---

## 📝 Notes

- **LocalStorage Key:** `taskflow_tasks`
- **Backend Port:** 5000
- **Frontend Port:** 3000
- **Database Name:** `taskflow`
- **Collection Name:** `tasks`

The app is designed to work seamlessly with or without backend, ensuring a great user experience even when offline!

