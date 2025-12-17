import React from 'react';
import { ArrowLeft, X, Eye, Trash2 } from 'lucide-react';
import { Lesson, DeleteConfirmationState, LessonType } from './Type';

interface LessonsListViewProps {
  lessons: Lesson[];
  isLoadingLessons: boolean;
  isDeleting: boolean;
  deleteConfirmation: DeleteConfirmationState;
  selectedLesson: Lesson | null;
  isModalOpen: boolean;
  lessonDetails: any;
  isLoadingDetails: boolean;
  onCreateLesson: () => void;
  onViewDetails: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string, lessonTitle: string) => void;
  onCloseModal: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

const LessonsListView: React.FC<LessonsListViewProps> = ({
  lessons,
  isLoadingLessons,
  isDeleting,
  deleteConfirmation,
  selectedLesson,
  isModalOpen,
  lessonDetails,
  isLoadingDetails,
  onCreateLesson,
  onViewDetails,
  onDeleteLesson,
  onCloseModal,
  onConfirmDelete,
  onCancelDelete
}) => {
  const getTypeColor = (type: LessonType) => {
    switch (type) {
      case LessonType.READING: return 'bg-orange-100 text-orange-600';
      case LessonType.WRITING: return 'bg-green-100 text-green-600';
      case LessonType.LISTENING: return 'bg-orange-100 text-orange-600';
      case LessonType.SPEAKING: return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Lessons</h1>
          <p className="text-gray-600 mt-2">Create and organize your learning lessons</p>
        </div>

        {/* Create Lesson Button */}
        <div className="mb-6">
          <button
            onClick={onCreateLesson}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Create Lesson
          </button>
        </div>

        {/* Lessons List */}
        {isLoadingLessons ? (
          <div className="text-center py-8">Loading lessons...</div>
        ) : lessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-center py-8">
              No lessons created yet. Click "Create Lesson" to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="mb-4 font-medium text-gray-700">
              Total lessons: {lessons.length || 0}
            </p>
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getTypeColor(lesson.type)}`}>
                    {lesson.type.charAt(0) + lesson.type.slice(1).toLowerCase()}
                  </span>
                </div>
                
                <h3 className="text-gray-900 font-semibold text-base mb-3">
                  {lesson.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeWidth="2" d="M12 6v6l4 2"/>
                  </svg>
                  <span>{lesson.provider === 'OPENAI' ? 'Open AI' : 'Grok'}</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => onViewDetails(lesson)}
                    className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button 
                    onClick={() => onDeleteLesson(lesson.id, lesson.title)}
                    disabled={isDeleting}
                    className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded hover:bg-red-100 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lesson Details Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Lesson Details</h2>
              
              {isLoadingDetails ? (
                <div className="text-center py-4">Loading...</div>
              ) : lessonDetails ? (
                <div className="space-y-3">
                  <p><strong>Title:</strong> {lessonDetails.data.title}</p>
                  <p><strong>Type:</strong> {lessonDetails.data.type}</p>
                  <p><strong>Provider:</strong> {lessonDetails.data.provider}</p>
                  <p><strong>Status:</strong> {lessonDetails.data.status || 'DRAFT'}</p>
                  {lessonDetails.data.createdAt && (
                    <p><strong>Created:</strong> {new Date(lessonDetails.data.createdAt).toLocaleDateString()}</p>
                  )}
                </div>
              ) : (
                <div>Error loading details</div>
              )}
              
              <button
                onClick={onCloseModal}
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6">Delete lesson "{deleteConfirmation.lessonTitle}"?</p>
              <div className="flex gap-2">
                <button onClick={onCancelDelete} className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={onConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsListView;