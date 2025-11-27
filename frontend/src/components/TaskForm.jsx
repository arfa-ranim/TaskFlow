import { useState } from 'react'

function TaskForm({ onAdd, activeFilter = 'all', onFilterChange }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
      })
      setTitle('')
      setDescription('')
      setDueDate('')
    }
  }

  const filterOptions = [
    { value: 'all', label: 'All Tasks', icon: '📋' },
    { value: 'completed', label: 'Completed Tasks', icon: '✓' },
    { value: 'pending', label: 'Pending Tasks', icon: '⏳' },
    { value: 'overdue', label: 'Overdue Tasks', icon: '⚠️' },
  ]

  const currentFilter = filterOptions.find(opt => opt.value === activeFilter) || filterOptions[0]

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-900">Add New Task</h2>
        
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Filter tasks"
            aria-expanded={isFilterOpen}
          >
            <span className="flex items-center gap-2">
              <span>{currentFilter.icon}</span>
              <span className="hidden sm:inline">{currentFilter.label}</span>
              <span className="sm:hidden">Filter</span>
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden animate-fade-in">
                <div className="py-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onFilterChange && onFilterChange(option.value)
                        setIsFilterOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-150 ${
                        activeFilter === option.value
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm sm:text-base">{option.label}</span>
                      {activeFilter === option.value && (
                        <span className="ml-auto text-indigo-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter task title..."
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter task description..."
            rows="3"
            required

          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date (optional)
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
           

          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
        >
          ➕ Add Task
        </button>
      </form>
    </div>
  )
}

export default TaskForm

