export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-500";
    case "Medium":
      return "bg-yellow-500";
    default:
      return "bg-green-500";
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "Billing":
      return "bg-blue-100 text-blue-800";
    case "Technical":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
