import { useMemo } from 'react'
import { format, startOfDay, parseISO, isSameDay } from 'date-fns'

function StatsDashboard({ tasks }) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    const overdue = tasks.filter(
      t => t.dueDate && !t.completed && new Date(t.dueDate) < new Date()
    ).length

    // Tasks completed per day
    const completionByDay = {}
    tasks
      .filter(t => t.completed && t.completedAt)
      .forEach(task => {
        const day = format(startOfDay(parseISO(task.completedAt)), 'yyyy-MM-dd')
        completionByDay[day] = (completionByDay[day] || 0) + 1
      })

    // Get last 30 days
    const last30Days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayKey = format(startOfDay(date), 'yyyy-MM-dd')
      last30Days.push({
        date: dayKey,
        dateFormatted: format(date, 'MMM dd'),
        count: completionByDay[dayKey] || 0,
      })
    }

    // Completion rate
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      completionByDay: last30Days,
    }
  }, [tasks])

  const maxCount = Math.max(...stats.completionByDay.map(d => d.count), 1)

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 mb-4 sm:mb-6">Statistics Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg p-4 sm:p-6 shadow-md">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.total}</div>
          <div className="text-indigo-100 text-sm sm:text-base">Total Tasks</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 sm:p-6 shadow-md">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.completed}</div>
          <div className="text-green-100 text-sm sm:text-base">Completed</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-4 sm:p-6 shadow-md">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.pending}</div>
          <div className="text-yellow-100 text-sm sm:text-base">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4 sm:p-6 shadow-md">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.overdue}</div>
          <div className="text-red-100 text-sm sm:text-base">Overdue</div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Completion Rate</h3>
        <div className="bg-gray-200 rounded-full h-6 sm:h-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          >
            {stats.completionRate > 10 ? `${stats.completionRate}%` : ''}
          </div>
        </div>
        {stats.completionRate <= 10 && (
          <div className="text-xs sm:text-sm text-gray-600 mt-1 text-center">
            {stats.completionRate}%
          </div>
        )}
      </div>

      {/* Daily Completion Chart */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[600px] sm:min-w-0 px-4 sm:px-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
            Tasks Completed per Day (Last 30 Days)
          </h3>
          <div className="flex items-end gap-1 sm:gap-2 h-48 sm:h-64 border-b-2 border-gray-300 pb-2">
            {stats.completionByDay.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                <div className="relative w-full flex items-end justify-center h-[150px] sm:h-[200px]">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      day.count > 0
                        ? 'bg-gradient-to-t from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
                        : 'bg-gray-200'
                    }`}
                    style={{
                      height: `${(day.count / maxCount) * 100}%`,
                      minHeight: day.count > 0 ? '4px' : '2px',
                    }}
                    title={`${day.dateFormatted}: ${day.count} task(s)`}
                  >
                    {day.count > 0 && (
                      <div className="absolute -top-5 sm:-top-6 left-1/2 transform -translate-x-1/2 text-[10px] sm:text-xs font-semibold text-gray-700 whitespace-nowrap">
                        {day.count}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`text-[10px] sm:text-xs font-medium ${
                    isSameDay(parseISO(day.date), new Date()) ? 'text-indigo-600 font-bold' : 'text-gray-600'
                  }`}
                >
                  {format(parseISO(day.date), 'dd')}
                </div>
                {index % 7 === 0 && (
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                    {format(parseISO(day.date), 'MMM')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
          <h4 className="font-semibold text-indigo-900 mb-2 text-sm sm:text-base">📊 Productivity Insights</h4>
          <p className="text-gray-700 text-xs sm:text-sm">
            You've completed {stats.completed} out of {stats.total} tasks.
            {stats.completionRate >= 80 && ' Excellent work! Keep it up! 🎉'}
            {stats.completionRate >= 50 && stats.completionRate < 80 && ' Good progress! 💪'}
            {stats.completionRate < 50 && ' Keep going, you got this! 💯'}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
          <h4 className="font-semibold text-yellow-900 mb-2 text-sm sm:text-base">⏰ Attention Needed</h4>
          <p className="text-gray-700 text-xs sm:text-sm">
            {stats.overdue > 0
              ? `You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''}. Consider prioritizing them!`
              : 'No overdue tasks! Great time management! ✅'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatsDashboard
