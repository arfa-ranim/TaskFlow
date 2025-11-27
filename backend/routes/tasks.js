import express from 'express'
import { Task } from '../models/Task.js'

const router = express.Router()

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll()
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (task) {
      res.json(task)
    } else {
      res.status(404).json({ error: 'Task not found' })
    }
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
})

// Create task
router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body)
    res.status(201).json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.update(req.params.id, req.body)
    if (task) {
      res.json(task)
    } else {
      res.status(404).json({ error: 'Task not found' })
    }
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.delete(req.params.id)
    if (deleted) {
      res.json({ message: 'Task deleted successfully' })
    } else {
      res.status(404).json({ error: 'Task not found' })
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// Sync tasks (for bulk operations)
router.post('/sync', async (req, res) => {
  try {
    const { tasks } = req.body
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Tasks must be an array' })
    }
    const syncedTasks = await Task.sync(tasks)
    res.json(syncedTasks)
  } catch (error) {
    console.error('Error syncing tasks:', error)
    res.status(500).json({ error: 'Failed to sync tasks' })
  }
})

export default router

