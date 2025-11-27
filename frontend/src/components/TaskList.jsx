import { Droppable, Draggable } from 'react-beautiful-dnd'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onUpdate, onDelete, onToggleComplete, filter = 'all' }) {
  // Filter tasks based on the filter prop
  // Note: The filtering is already done in App.jsx, but we keep this for backward compatibility
  const displayTasks = tasks

  return (
    <Droppable droppableId="tasks-droppable">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[100px] p-3 sm:p-4 rounded-lg transition-all duration-300 animate-fade-in ${
            snapshot.isDraggingOver
              ? 'bg-indigo-100 border-2 border-indigo-300 border-dashed'
              : 'bg-white'
          }`}
        >
          {displayTasks.length === 0 ? (
            <div className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base animate-fade-in">
              {filter === 'completed' && 'No completed tasks yet. Complete some tasks to see them here! ✨'}
              {filter === 'pending' && 'No pending tasks. Add one above! ✨'}
              {filter === 'overdue' && 'No overdue tasks! Great job staying on top of things! ✅'}
              {filter === 'all' && 'No tasks yet. Add one above! ✨'}
            </div>
          ) : (
            displayTasks.map((task, index) => {
              const draggableId = task.id.toString() // always a string
              return (
                <Draggable key={draggableId} draggableId={draggableId} index={index}>
                  {(provided, snapshot) => (
                    <TaskItem
                      task={task}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onToggleComplete={onToggleComplete}
                      provided={provided}
                      isDragging={snapshot.isDragging}
                    />
                  )}
                </Draggable>
              )
            })
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
