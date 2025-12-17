  
interface DashboardHeaderProps {
  onAddNew?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  // const [loading, setLoading] = useState(false);

  // const handleAddNew = async () => {
  //   if (onAddNew) {
  //     setLoading(true);
  //     await onAddNew();
  //     setLoading(false);
  //   }
  // };

  return (
<div className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200 dark:border-gray-800 transition-colors">
  <div className="flex flex-col sm:flex-row justify-between items-center">
    <div className="mb-4 sm:mb-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
        Support Management
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mt-1 dark:text-gray-400">
        Welcome back! Here's what's happening with your platform today.
      </p>
    </div>

    {/* <button
      onClick={handleAddNew}
      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition font-medium shadow-sm text-sm sm:text-base lg:text-lg"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin text-sm sm:text-base lg:text-lg" />
      ) : (
        <Plus className="text-sm sm:text-base lg:text-lg" />
      )}
      {loading ? "Adding..." : "Add New Plan"}
    </button> */}
  </div>
</div>

  );
};
