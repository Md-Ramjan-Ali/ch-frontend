"use client"
import React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 dark:bg-black/70">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">{title}</h2>
        {children}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
