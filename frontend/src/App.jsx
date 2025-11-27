import { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import StatsDashboard from './components/StatsDashboard'
import { normalizeTask } from './utils/tasks'
import {
  syncWithBackend,
  getTasks,
  saveTasksToLocal,
  getTasksFromLocal,
  createTask,
  updateTask,
  deleteTask
} from './utils/storage'


function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'completed', 'pending', 'overdue'

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const backendTasks = (await getTasks()).map(normalizeTask)
      if (backendTasks?.length) {
        setTasks(backendTasks)
        saveTasksToLocal(backendTasks)
      } else {
        const localTasks = getTasksFromLocal()
        setTasks(localTasks || [])
        if (localTasks?.length) await syncWithBackend(localTasks)
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
      const localTasks = getTasksFromLocal()
      setTasks(localTasks || [])
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (taskData) => {
    const tempId = Date.now().toString()
    const newTask = {
      id: tempId,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    saveTasksToLocal(updatedTasks)

    try {
      const created = normalizeTask(await createTask(newTask))
      const finalTasks = updatedTasks.map(t => (t.id === tempId ? created : t))
      setTasks(finalTasks)
      saveTasksToLocal(finalTasks)
    } catch (error) {
      console.error('Create task failed, syncing bulk...', error)
      await syncWithBackend(updatedTasks)
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, ...updates } : t
    )
    setTasks(updatedTasks)
    saveTasksToLocal(updatedTasks)

    try {
      const taskToUpdate = updatedTasks.find(t => t.id === taskId)
      await updateTask(taskToUpdate.id, updates)
    } catch (error) {
      console.error('Update failed, syncing bulk...', error)
      await syncWithBackend(updatedTasks)
    }
  }

  const handleDeleteTask = async (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId)
    setTasks(updatedTasks)
    saveTasksToLocal(updatedTasks)

    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error('Delete failed, syncing bulk...', error)
      await syncWithBackend(updatedTasks)
    }
  }

  const handleToggleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    handleUpdateTask(taskId, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null,
    })
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)

    setTasks(items)
    saveTasksToLocal(items)
    syncWithBackend(items)
  }

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType)
  }

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'completed':
        return tasks.filter(t => t.completed)
      case 'pending':
        return tasks.filter(t => !t.completed)
      case 'overdue':
        return tasks.filter(
          t => t.dueDate && !t.completed && new Date(t.dueDate) < new Date()
        )
      case 'all':
      default:
        return tasks
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-indigo-600 text-lg font-semibold">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        <header className="mb-4 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900 mb-1 sm:mb-2">TaskFlow</h1>
          <p className="text-indigo-600 text-sm sm:text-base md:text-lg">Smart Todo App with Sync & Stats</p>
        </header>

        <div className="mb-4 sm:mb-6 flex justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
              showStats
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-md'
            }`}
          >
            {showStats ? 'Show Tasks' : 'Show Stats'}
          </button>
        </div>

        {showStats ? (
          <StatsDashboard tasks={tasks} />
        ) : (
          <>
            <TaskForm onAdd={handleAddTask} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
            <DragDropContext onDragEnd={handleDragEnd}>
              <div key={activeFilter} className="transition-all duration-300">
                <TaskList
                  tasks={getFilteredTasks()}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  filter={activeFilter}
                />
              </div>
            </DragDropContext>
          </>
        )}
      </div>
    </div>
  )
}

export default App
