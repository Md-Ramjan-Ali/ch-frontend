
import React from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const studyTimeData = [
  { name: '2024-09-23', time: 2200 },
  { name: '2024-09-24', time: 2400 },
  { name: '2024-09-25', time: 2000 },
  { name: '2024-09-26', time: 2780 },
  { name: '2024-09-27', time: 2600 },
  { name: '2024-09-28', time: 2900 },
  { name: '2024-09-29', time: 3100 },
];

const flashcardData = [
    { name: '2024-09-23', reviews: 9000 },
    { name: '2024-09-24', reviews: 8500 },
    { name: '2024-09-25', reviews: 8000 },
    { name: '2024-09-26', reviews: 9500 },
    { name: '2024-09-27', reviews: 10000 },
    { name: '2024-09-28', reviews: 10500 },
    { name: '2024-09-29', reviews: 12000 },
];

const LearningProgressView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Study Time Distribution</h3>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">Average daily study time across user segments</p>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={studyTimeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <YAxis tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                  color: '#e5e7eb'
                }}
              />
              <Line type="monotone" dataKey="time" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Flashcard Review Trends</h3>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">Daily flashcard reviews and learning activity</p>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart data={flashcardData}>
                    <defs>
                        <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
                    <YAxis tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
                    <Tooltip contentStyle={{
                        backgroundColor: '#374151',
                        border: '1px solid #4b5563',
                        borderRadius: '0.5rem',
                        color: '#e5e7eb'
                    }}/>
                    <Area type="monotone" dataKey="reviews" stroke="#14b8a6" fillOpacity={1} fill="url(#colorReviews)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LearningProgressView;
