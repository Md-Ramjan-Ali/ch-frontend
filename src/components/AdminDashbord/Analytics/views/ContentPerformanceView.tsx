
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const contentPerformanceData = [
  { name: 'Basic Greetings', views: 2500, completion: 1900 },
  { name: 'Food & Restaurants', views: 2200, completion: 1700 },
  { name: 'Travel Phrases', views: 1800, completion: 1400 },
  { name: 'Verb Conjugations', views: 1500, completion: 1100 },
  { name: 'Italian Culture', views: 1200, completion: 950 },
  { name: 'Numbers & Time', views: 1150, completion: 900 },
];

const ContentPerformanceView: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Content Performance</h3>
      <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">Views, completion rates, and ratings for top content</p>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={contentPerformanceData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
            <YAxis tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: '1px solid #4b5563',
                    borderRadius: '0.5rem',
                    color: '#e5e7eb'
                }}
            />
            <Legend wrapperStyle={{fontSize: "14px"}} />
            <Bar dataKey="views" fill="#8b5cf6" name="Views" />
            <Bar dataKey="completion" fill="#14b8a6" name="Completions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContentPerformanceView;
