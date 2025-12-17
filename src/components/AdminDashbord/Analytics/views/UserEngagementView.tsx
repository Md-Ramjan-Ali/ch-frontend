
import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dailyActivityData = [
  { name: '2024-09-23', studyTime: 1200, reviews: 1500 },
  { name: '2024-09-24', studyTime: 1400, reviews: 1600 },
  { name: '2024-09-25', studyTime: 1300, reviews: 1450 },
  { name: '2024-09-26', studyTime: 1600, reviews: 1800 },
  { name: '2024-09-27', studyTime: 1550, reviews: 1900 },
  { name: '2024-09-28', studyTime: 1700, reviews: 2000 },
  { name: '2024-09-29', studyTime: 1800, reviews: 2100 },
];

const deviceUsageData = [
  { name: 'Mobile', value: 65 },
  { name: 'Desktop', value: 28 },
  { name: 'Tablet', value: 7 },
];
const DEVICE_COLORS = ['#8b5cf6', '#14b8a6', '#f59e0b'];

const progressByLevelData = [
  { name: 'Beginner', users: 1500, progress: 80 },
  { name: 'Intermediate', users: 1100, progress: 150 },
  { name: 'Advanced', users: 450, progress: 200 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
        <p className="font-bold dark:text-gray-200">{label}</p>
        <p className="text-teal-500">{`Reviews: ${payload[0].value}`}</p>
        <p className="text-indigo-500">{`Study Time: ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

const UserEngagementView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Daily User Activity</h3>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">Active users, study time, and flashcard reviews over the past week</p>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={dailyActivityData}>
              <defs>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorStudyTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
              <YAxis tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="reviews" stroke="#14b8a6" fillOpacity={1} fill="url(#colorReviews)" stackId="1" />
              <Area type="monotone" dataKey="studyTime" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorStudyTime)" stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Device Usage</h3>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">How users access the platform</p>
          <div style={{ width: '100%', height: 250 }} className="flex flex-col items-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={deviceUsageData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                  {deviceUsageData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {deviceUsageData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: DEVICE_COLORS[index] }}></span>
                  {entry.name}: {entry.value}%
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Learning Progress by Level</h3>
          <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">User distribution and average progress</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={progressByLevelData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
                <YAxis tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
                <Tooltip />
                <Bar dataKey="users" fill="#8b5cf6" name="Users" />
                <Bar dataKey="progress" fill="#14b8a6" name="Progress" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementView;
