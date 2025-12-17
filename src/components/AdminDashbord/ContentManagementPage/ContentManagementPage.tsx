 import { useNavigate } from 'react-router-dom';
import StatCard from './components/StatCard';
import { BookIcon, LessonIcon, FlashcardIcon, ViewIcon } from './components/icons';
 
 
import { useGetAllCategoriesQuery,   } from '@/redux/features/flashcards/flashcardsApi';
 
const ContentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: flascardData, isLoading } = useGetAllCategoriesQuery();
console.log(flascardData)
  

   

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 p-4 sm:p-6 lg:p-8 dark:bg-gray-900 dark:text-gray-200">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold">Content Management</h1>

        </div>


        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard 
            title="Total Categories  Decks" 
            value={(flascardData?.data?.length ?? 0).toString()} 
            icon={<BookIcon />}
       
          />
          <StatCard 
            title="Published Lessons" 
                  value={(flascardData?.data?.length ?? 0).toString()} 
            icon={<LessonIcon />}
            
          />
          <StatCard 
            title="Total Flashcards" 
                value={(flascardData?.data?.length ?? 0).toString()} 
            icon={<FlashcardIcon />}
             
          />
          <StatCard 
            title="Content Views" 
                value={(flascardData?.data?.length ?? 0).toString()} 
            icon={<ViewIcon />}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/admin/content/flashcards')}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Flashcard Decks</h3>
            <p className="text-slate-600 dark:text-gray-400 mb-4">Manage your flashcard collections</p>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Manage →</span>
          </button>
          
          <button
            onClick={() => navigate('/admin/content/lessons')}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Lessons</h3>
            <p className="text-slate-600 dark:text-gray-400 mb-4">Create and manage learning lessons</p>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Manage →</span>
          </button>
          
          
        </div>
      </div>
    </div>
  );
};

export default ContentManagementPage;



 