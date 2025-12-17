import type React from "react"
// Force re-evaluation
interface PriorityTagProps {
  priority: string
}

export const PriorityTag: React.FC<PriorityTagProps> = ({ priority }) => {
  let colorClass
  switch (priority) {
    case "High":
      colorClass = "bg-red-500 dark:bg-red-700"
      break
    case "MEDIUM":
      colorClass = "bg-orange-400 dark:bg-orange-600"
      break
    case "Low":
      colorClass = "bg-teal-500 dark:bg-teal-700"
      break
    default:
      colorClass = "bg-gray-400 dark:bg-gray-600"
      break
  }
  return <span className={`${colorClass} text-white px-3 py-1 rounded-full text-xs font-medium`}>{priority}</span>
}
