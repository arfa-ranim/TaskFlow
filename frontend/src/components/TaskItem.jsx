import { useState } from 'react'
import { format } from 'date-fns'
import { formatDistanceToNow } from 'date-fns'

function TaskItem({ task, onUpdate, onDelete, onToggleComplete, provided, isDragging }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  )

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        dueDate: editDueDate || null,
      })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '')
    setIsEditing(false)
  }

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date()
  const dueDateFormatted = task.dueDate
    ? format(new Date(task.dueDate), 'MMM dd, yyyy')
    : null

  const dragProps = provided
    ? {
        ref: provided.innerRef,
        ...provided.draggableProps,
        ...provided.dragHandleProps,
      }
    : {}

  return (
    <div
      {...dragProps}
      className={`bg-white rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 shadow-md transition-all ${
        isDragging ? 'opacity-50 rotate-2 scale-105 shadow-xl' : 'hover:shadow-lg'
      } ${task.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Description (optional)"
            rows="2"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 sm:gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 rounded focus:ring-indigo-500 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base sm:text-lg font-semibold ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">{task.description}</p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
              {dueDateFormatted && (
                <span
                  className={`font-medium ${
                    isOverdue ? 'text-red-600' : 'text-indigo-600'
                  }`}
                >
                  📅 Due: {dueDateFormatted}
                  {isOverdue && ' (Overdue!)'}
                </span>
              )}
              {task.createdAt && (
                <span>
                  Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </span>
              )}
              {task.completed && task.completedAt && (
                <span className="text-green-600">
                  ✓ Completed {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 sm:px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors text-xs sm:text-sm active:scale-95"
              aria-label="Edit task"
            >
              <span className="hidden sm:inline">✏️ Edit</span>
              <span className="sm:hidden">✏️</span>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="px-2 sm:px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-xs sm:text-sm active:scale-95"
              aria-label="Delete task"
            >
              <span className="hidden sm:inline">🗑️ Delete</span>
              <span className="sm:hidden">🗑️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskItem

