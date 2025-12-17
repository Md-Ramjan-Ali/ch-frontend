 import type React from "react"

interface CategoryTagProps {
  category: string
}

// const {data:datas}=useGetMeQuery({})
// //(datas)
export const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
  let colorClass
  switch (category) {
    case "In Progress":
      colorClass = "text-blue-600 bg-blue-100/70 dark:text-blue-300 dark:bg-blue-800/70"
      break
    case "RESOLVED":
      colorClass = "text-green-600 bg-green-100/70 dark:text-green-300 dark:bg-green-800/70"
      break
    case "OPEN":
      colorClass = "text-pink-600 bg-pink-100/70 dark:text-pink-300 dark:bg-pink-800/70"
      break
    default:
      colorClass = "text-gray-600 bg-gray-100/70 dark:text-gray-300 dark:bg-gray-700/70"
      break
  }
  return <span className={`${colorClass} px-3 py-1 rounded-full text-xs font-medium`}>{category}</span>
}
