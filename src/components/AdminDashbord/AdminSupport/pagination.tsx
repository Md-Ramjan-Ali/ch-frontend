import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const createPageList = () => {
    let pages: (number | string)[] = []

    // Always show 1,2
    pages.push(1)
    if (totalPages >= 2) pages.push(2)

    // Add "..." if needed before current
    if (currentPage > 4) pages.push("...")

    // Show currentPage -1, currentPage, currentPage+1
    for (let p = currentPage - 1; p <= currentPage + 1; p++) {
      if (p > 2 && p < totalPages - 1) {
        pages.push(p)
      }
    }

    // Add "..." if needed after current
    if (currentPage < totalPages - 3) pages.push("...")

    // Always show last 2 pages
    if (totalPages > 2) pages.push(totalPages - 1)
    if (totalPages > 1) pages.push(totalPages)

    // Remove duplicates
    return [...new Set(pages)]
  }

  const pages = createPageList()

  return (
    <div className="px-6 py-4 border-t flex justify-between items-center dark:border-gray-700">
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-1 items-center">

        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 dark:hover:bg-gray-700 dark:border-gray-600"
        >
          <ChevronLeft size={18} />
        </button>

        {pages.map((p, index) => (
          <button
            key={index}
            disabled={p === "..."}
            onClick={() => typeof p === "number" && onPageChange(p)}
            className={`px-3 py-1 rounded-lg text-sm font-medium 
              ${currentPage === p 
                ? "bg-blue-600 text-white shadow-md" 
                : p === "..."
                  ? "cursor-default text-gray-400"
                  : "hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
              }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 dark:hover:bg-gray-700 dark:border-gray-600"
        >
          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  )
}
