import React from "react";
import caricon from "../../../assets/Dashbord/shioingcar.svg"; // ✅ include extension
import boxicon from "../../../assets/Dashbord/box-delivery 1.svg"; // ✅ ok

interface Activity {
  type: "user" | "subscription" | "task" | "support";
  title: string;
  desc: string;
  time: string;
}

const activities: Activity[] = [
  {
    type: "user",
    title: "New user registration",
    desc: "Sarah Johnson joined the platform",
    time: "2h ago",
  },
  {
    type: "subscription",
    title: "New Pro subscription",
    desc: "Michael Chen upgraded to Pro plan",
    time: "Yesterday",
  },
  {
    type: "task",
    title: "Deck completed",
    desc: 'Emma Davis completed "Spanish Basics" deck',
    time: "Yesterday",
  },
  {
    type: "subscription",
    title: "New Pro subscription",
    desc: "Michael Chan upgraded to Pro plan",
    time: "Yesterday",
  },
  {
    type: "support",
    title: "Support ticket",
    desc: "Alex opened request ticket Ann",
    time: "Yesterday",
  },
];

const AdminRecentActivity: React.FC = () => (
  <div className="bg-white p-6 rounded-lg dark:bg-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-semibold dark:text-gray-200">Recent Activity</h2>
      <button className="text-blue-500 text-sm cursor-pointer dark:text-blue-400">View all</button>
    </div>

    <div className="space-y-5 mt-6">
      {activities.map((activity, idx) => (
        <div key={idx} className="flex gap-3">
          <div
            className={`w-8 h-8 rounded flex items-center justify-center   ${
              activity.type === "user" ? "bg-yellow-100" : "bg-purple-100"
            }`} 
          >
            {activity.type === "user" && <img src={boxicon} alt="User" />}
            {activity.type === "subscription" && <img src={caricon} alt="Subscription" />}
            {activity.type === "task" && <img src={caricon} alt="Task" />}
            {activity.type === "support" && <img src={caricon} alt="Support" />}
          </div>

          <div className="flex-1">
            <div className="font-medium text-xl dark:text-gray-200">{activity.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{activity.desc}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminRecentActivity;
