import { useUserRole, type UserRole } from "@/hooks/useUserRole";
import CommonWrapper from "../common/CommonWrapper";
import { Link } from "react-router-dom";
import { 
  Shield, 
  User, 
  UserCheck, 
  ArrowRight, 
  Settings,
  BarChart3,
  Users,
  Sparkles
} from "lucide-react";

const Home = () => {
  const { setRole } = useUserRole();

  const roleCards: {
    title: string;
    role: UserRole;
    description: string;
    icon: React.ElementType;
    features: string[];
    color: string;
    bgColor: string;
    borderColor: string;
  }[] = [
    {
      title: "Admin Dashboard",
      role: "admin",
      description: "Full system access with advanced controls",
      icon: Shield,
      features: ["User Management", "Analytics", "System Settings"],
      color: "from-red-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20",
      borderColor: "border-red-200 dark:border-red-800"
    },
    {
      title: "Pro User Dashboard",
      role: "user",
      description: "Premium features for professional users",
      icon: UserCheck,
      features: ["Advanced Analytics", "Priority Support", "Custom Reports"],
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      title: "Free User Dashboard",
      role: "freeUser",
      description: "Essential features to get started",
      icon: User,
      features: ["Basic Analytics", "Standard Support", "Core Features"],
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      borderColor: "border-green-200 dark:border-green-800"
    }
  ];

  return (
    <CommonWrapper>
      <div className="min-h-screen from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Welcome to Your Dashboard
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Manage Your
              <span className="block from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Platform
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Track progress, oversee users, and explore all features in one powerful dashboard.
            </p>

            {/* Testing Info */}
            <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl px-6 py-4 mb-12">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Note:</span>
              </div>
              <p className="text-blue-800 dark:text-blue-200 text-lg">
                Use any email or password to log in
              </p>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {roleCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.role}
                    className={`group relative overflow-hidden rounded-3xl border-2 ${card.borderColor} ${card.bgColor} p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    {/* Header */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-3 rounded-2xl  ${card.color}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300" />
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {card.description}
                      </p>

                      {/* Features List */}
                      <ul className="space-y-3 mb-8">
                        {card.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <div className={`w-2 h-2 rounded-full  ${card.color}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Action Button */}
                      <Link
                        to={`/signup`}
                        // to={`/${card.role === "user" ? "user" : card.role === "freeUser" ? "freeuser" : card.role}`}
                        className={`inline-flex items-center justify-center w-full py-4 px-6 rounded-2xl ${card.color} text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group/btn`}
                        onClick={() => setRole(card.role)}
                      >
                        <span>Access Dashboard</span>
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="max-w-4xl mx-auto mt-20 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Real-time Analytics
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Track performance with live data and insights
                </p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  User Management
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage users and permissions efficiently
                </p>
              </div>
              <div className="text-center">
                <Settings className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Customizable
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Tailor the dashboard to your specific needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Home;