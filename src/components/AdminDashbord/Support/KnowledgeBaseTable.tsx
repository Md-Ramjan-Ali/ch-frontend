import React from "react";
import { KnowledgeArticle } from "./types";

interface Props {
  articles: KnowledgeArticle[];
}

const KnowledgeBaseTable: React.FC<Props> = ({ articles }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
            Last Update
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
            Views
          </th>
        </tr>
      </thead>
      <tbody className="divide-y dark:divide-gray-700">
        {articles.map(article => (
          <tr 
            key={article.id} 
            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
              {article.title}
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                {article.category}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {article.lastUpdate}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {article.views.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default KnowledgeBaseTable;