export const normalizeTask = (task) => ({
  id: task._id ? task._id.toString() : task.id?.toString(),
  title: task.title,
  description: task.description || '',
  completed: task.completed || false,
  dueDate: task.dueDate || null,
  createdAt: task.createdAt || new Date().toISOString(),
  completedAt: task.completedAt || null,
})
