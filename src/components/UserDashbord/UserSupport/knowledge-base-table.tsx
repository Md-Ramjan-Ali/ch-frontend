import type React from "react"
import type { KnowledgeArticle } from "./types"

interface KnowledgeBaseTableProps {
  articles: KnowledgeArticle[]
}

export const KnowledgeBaseTable: React.FC<KnowledgeBaseTableProps> = ({ articles }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 border-b dark:bg-gray-700 dark:border-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Views</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Last Edited</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Author</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {articles.map((article: KnowledgeArticle, index: number) => (
            <tr key={index} className="hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-700">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">{article.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">{article.title}</td>
              <td className="px-6 py-4">
                <span className="text-purple-600 bg-purple-100/70 px-3 py-1 rounded-full text-xs font-medium dark:text-purple-300 dark:bg-purple-800/70">
                  {article.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{article.views.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{article.lastEdited}</td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{article.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
