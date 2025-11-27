import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// LocalStorage operations
export const saveTasksToLocal = (tasks) => {
  try {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const getTasksFromLocal = () => {
  try {
    const tasks = localStorage.getItem('taskflow_tasks')
    return tasks ? JSON.parse(tasks) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

// Backend API operations
export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`)
    return response.data
  } catch (error) {
    console.error('Error fetching tasks from backend:', error)
    throw error
  }
}

export const syncWithBackend = async (tasks) => {
  try {
    await axios.post(`${API_BASE_URL}/tasks/sync`, { tasks })
    console.log('Tasks synced with backend successfully')
  } catch (error) {
    console.error('Error syncing with backend:', error)
    // Don't throw error - allow app to continue with local storage
  }
}

export const createTask = async (task) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, task)
    return response.data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export const updateTask = async (taskId, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updates)
    return response.data
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`)
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

