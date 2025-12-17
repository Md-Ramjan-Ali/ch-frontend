
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const retentionData = [
  { name: 'Week 1', retention: 85 },
  { name: 'Week 2', retention: 75 },
  { name: 'Week 3', retention: 65 },
  { name: 'Week 4', retention: 54 },
  { name: 'Week 8', retention: 48 },
  { name: 'Week 12', retention: 38 },
];

const UserRetentionView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">User Retention Analysis</h3>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">User retention rates over time (cohort analysis)</p>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <LineChart
              data={retentionData}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#A0AEC0' }} stroke="#A0AEC0" />
              <Tooltip
                 contentStyle={{
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '0.5rem',
                    color: '#e5e7eb'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Retention']}
              />
              <Line type="monotone" dataKey="retention" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 5, fill: '#8b5cf6' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Key Insights</h3>
        <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside dark:text-gray-400">
            <li>85% of users remain active after the first week</li>
            <li>54% retention rate at the 4-week mark</li>
            <li>Strong long-term retention with 38% active after 12 weeks</li>
            <li>Pro users show 23% higher retention rates</li>
        </ul>
      </div>
    </div>
  );
};

export default UserRetentionView;
