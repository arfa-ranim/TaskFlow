import { getDB } from '../config/database.js'
import { ObjectId } from 'mongodb'

export class Task {
  constructor(data) {
    this.title = data.title
    this.description = data.description || ''
    this.dueDate = data.dueDate || null
    this.completed = data.completed || false
    this.createdAt = data.createdAt || new Date().toISOString()
    this.completedAt = data.completedAt || null
    if (data.id) {
      this._id = typeof data.id === 'string' ? new ObjectId(data.id) : data.id
    }
  }

  static async create(taskData) {
    const db = getDB()
    // Extract id if present, but let MongoDB generate _id
    const { id: originalId, ...dataToInsert } = taskData
    const task = {
      title: dataToInsert.title,
      description: dataToInsert.description || '',
      dueDate: dataToInsert.dueDate || null,
      completed: dataToInsert.completed || false,
      createdAt: dataToInsert.createdAt || new Date().toISOString(),
      completedAt: dataToInsert.completedAt || null,
      // Store original id as a field for reference
      id: originalId || null,
    }
    const result = await db.collection('tasks').insertOne(task)
    // Return with MongoDB _id as the primary id, but preserve original id if it exists
    return { 
      ...task, 
      _id: result.insertedId, 
      id: originalId || result.insertedId.toString() 
    }
  }

  static async findAll() {
    const db = getDB()
    const tasks = await db.collection('tasks').find({}).toArray()
    return tasks.map(task => {
      const { _id, ...taskData } = task
      return {
        ...taskData,
        id: _id.toString(),
      }
    })
  }

  static async findById(id) {
    const db = getDB()
    let task
    try {
      if (ObjectId.isValid(id)) {
        task = await db.collection('tasks').findOne({ _id: new ObjectId(id) })
      } else {
        // Try to find by string id if it's not a valid ObjectId
        task = await db.collection('tasks').findOne({ id: id })
      }
    } catch (error) {
      return null
    }
    if (task) {
      const { _id, ...taskData } = task
      return {
        ...taskData,
        id: _id ? _id.toString() : id,
      }
    }
    return null
  }

  static async update(id, updates) {
    const db = getDB()
    let query
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      } else {
        query = { id: id }
      }
    } catch (error) {
      return null
    }
    const result = await db.collection('tasks').findOneAndUpdate(
      query,
      { $set: updates },
      { returnDocument: 'after' }
    )
    if (result.value) {
      const { _id, ...taskData } = result.value
      return {
        ...taskData,
        id: _id ? _id.toString() : id,
      }
    }
    return null
  }

  static async delete(id) {
    const db = getDB()
    let query
    try {
      if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) }
      } else {
        query = { id: id }
      }
    } catch (error) {
      return false
    }
    const result = await db.collection('tasks').deleteOne(query)
    return result.deletedCount > 0
  }

  static async sync(tasks) {
    const db = getDB()
    // Clear existing tasks
    await db.collection('tasks').deleteMany({})
    // Insert all tasks
    const tasksToInsert = tasks.map(task => {
      const { id, ...taskData } = task
      const taskToInsert = {
        title: taskData.title,
        description: taskData.description || '',
        dueDate: taskData.dueDate || null,
        completed: taskData.completed || false,
        createdAt: taskData.createdAt || new Date().toISOString(),
        completedAt: taskData.completedAt || null,
        id: id, // Store the original id as a field
      }
      // If id is a valid ObjectId, use it as _id, otherwise MongoDB will generate one
      if (id && ObjectId.isValid(id)) {
        taskToInsert._id = new ObjectId(id)
      }
      return taskToInsert
    })
    if (tasksToInsert.length > 0) {
      await db.collection('tasks').insertMany(tasksToInsert)
    }
    // Return tasks with their IDs preserved
    const syncedTasks = await db.collection('tasks').find({}).toArray()
    return syncedTasks.map(task => {
      const { _id, ...taskData } = task
      return {
        ...taskData,
        id: taskData.id || _id.toString(), // Use stored id or _id as fallback
      }
    })
  }
}

