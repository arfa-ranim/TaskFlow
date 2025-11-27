# 🚀 TaskFlow - Quick Start Guide

Since you've already installed MongoDB locally, here's what to do next:

## ✅ Step 1: Verify MongoDB is Running

**Option A: Check if MongoDB service is running**
```powershell
# In PowerShell
Get-Service -Name MongoDB
```

**Option B: Start MongoDB manually**
```powershell
# In a new terminal/PowerShell window
mongod
```

**Option C: Start MongoDB as Windows Service**
```powershell
# If MongoDB is installed as a service
Start-Service MongoDB
```

---

## ✅ Step 2: Install Dependencies (if not already done)

**Backend:**
```powershell
cd backend
npm install
```

**Frontend:**
```powershell
cd frontend
npm install
```

*Note: I can see you already have `node_modules` folders, so dependencies might already be installed!*

---

## ✅ Step 3: Start the Application

You need **TWO terminal windows**:

### Terminal 1 - Backend Server:
```powershell
cd C:\Users\youssef\taskflow\backend
npm run dev
```

**Expected output:**
```
✅ Connected to MongoDB successfully
🚀 Server is running on port 5000
📍 API available at http://localhost:5000/api
```

### Terminal 2 - Frontend Server:
```powershell
cd C:\Users\youssef\taskflow\frontend
npm run dev
```

**Expected output:**
```
  VITE v7.2.2  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

---

## ✅ Step 4: Open Your Browser

Navigate to: **http://localhost:3000**

You should see the TaskFlow app! 🎉

---

## 🧪 Quick Test

1. **Add a task:**
   - Fill in the form
   - Click "➕ Add Task"
   - Task should appear immediately

2. **Check if it's working:**
   - Open browser console (F12)
   - Look for: "Tasks synced with backend successfully"
   - No red errors = Everything is working! ✅

---

## 🐛 Troubleshooting

### Backend won't start:
- **MongoDB not running?** Start it first: `mongod` or `Start-Service MongoDB`
- **Port 5000 in use?** Change PORT in `backend/.env`
- **Check .env file exists** in `backend/` directory

### Frontend won't start:
- **Port 3000 in use?** Vite will automatically use next available port
- **Dependencies missing?** Run `npm install` in frontend directory

### "Cannot connect to MongoDB":
- Make sure MongoDB is running
- Check `backend/.env` has correct `MONGODB_URI`
- Try: `mongod` in a separate terminal

---

## 📋 What You Should See

✅ Backend terminal shows: "Connected to MongoDB successfully"
✅ Frontend terminal shows: "Local: http://localhost:3000/"
✅ Browser shows: TaskFlow app with form and task list
✅ Browser console (F12): No errors, sync messages appear

---

## 🎯 Ready to Go!

Once both servers are running and you see the app in your browser, you're all set! 

Try adding a task, editing it, completing it, and checking the stats dashboard!

