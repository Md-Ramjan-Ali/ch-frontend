import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// Define the chart colors
const TOTAL_USERS_COLOR = '#8e51ff'; // Purple line color
const NEW_USERS_COLOR = '#5b9ffc';   // Blue line color
const TOTAL_USERS_AREA_ID = 'colorTotalUsers';
const NEW_USERS_AREA_ID = 'colorNewUsers';

interface ChartData {
  month: string;
  totalUsers: number;
  newUsers: number;
}

// 1. Define data for different time periods (simulated)
// NOTE: I've created three datasets to simulate the behavior you want.
const dataLastYear: ChartData[] = [
    { month: 'Jan', totalUsers: 15000, newUsers: 8000 },
    { month: 'Feb', totalUsers: 18000, newUsers: 9000 },
    { month: 'Mar', totalUsers: 16000, newUsers: 8500 },
    { month: 'Apr', totalUsers: 22000, newUsers: 10000 },
    { month: 'May', totalUsers: 25000, newUsers: 11000 },
    { month: 'June', totalUsers: 28000, newUsers: 11500 },
    { month: 'July', totalUsers: 26000, newUsers: 10500 },
    { month: 'Aug', totalUsers: 30000, newUsers: 12500 },
    { month: 'Sep', totalUsers: 32000, newUsers: 13000 },
    { month: 'Oct', totalUsers: 31000, newUsers: 12000 },
    { month: 'Nov', totalUsers: 29000, newUsers: 11500 },
    { month: 'Dec', totalUsers: 34200, newUsers: 14000 },
];

const dataLastMonth: ChartData[] = [
    { month: 'W1', totalUsers: 30000, newUsers: 12000 },
    { month: 'W2', totalUsers: 31500, newUsers: 12500 },
    { month: 'W3', totalUsers: 30500, newUsers: 11000 },
    { month: 'W4', totalUsers: 32500, newUsers: 13000 },
];

const dataLastWeek: ChartData[] = [
    { month: 'Mon', totalUsers: 30000, newUsers: 12000 },
    { month: 'Tue', totalUsers: 30500, newUsers: 12200 },
    { month: 'Wed', totalUsers: 30200, newUsers: 11800 },
    { month: 'Thu', totalUsers: 31000, newUsers: 12500 },
    { month: 'Fri', totalUsers: 31500, newUsers: 13000 },
    { month: 'Sat', totalUsers: 32000, newUsers: 13200 },
    { month: 'Sun', totalUsers: 32500, newUsers: 13500 },
];

// Helper mapping to easily select the correct data
const chartDataMap: { [key: string]: ChartData[] } = {
  'Last Year': dataLastYear,
  'Last Month': dataLastMonth,
  'Last Week': dataLastWeek,
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formatValue = (value: number) => `${(value / 1000).toFixed(0)}k`;
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-lg text-sm rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
        <p className="font-semibold mb-1 text-[#484848] dark:text-gray-300">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.stroke }}>
            {`${entry.name}: `}
            <span className="font-medium">{formatValue(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom YAxis tick formatter
const formatYAxisTick = (value: number) => {
  return `${(value / 1000).toFixed(0)}k`;
};

const AdminUsersChart: React.FC = () => {
    // 2. Use state to track the selected time period
    const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof chartDataMap>('Last Year');

    // 3. Select the data based on the state
    const currentChartData = useMemo(() => chartDataMap[selectedPeriod], [selectedPeriod]);

    // Handler for dropdown change
    const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedPeriod(event.target.value as keyof typeof chartDataMap);
    };

    return (
        <div className="p-4 sm:p-6 rounded-lg mb-6 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            {/* Header Section - Responsive layout */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Users Overview</h2>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* Legend - Responsive layout */}
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full" style={{ backgroundColor: TOTAL_USERS_COLOR }}></div>
                            <span className="text-sm sm:text-base text-[#484848] font-semibold dark:text-gray-300 whitespace-nowrap">Total Users</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full" style={{ backgroundColor: NEW_USERS_COLOR }}></div>
                            <span className="text-sm sm:text-base font-semibold text-[#484848] dark:text-gray-300 whitespace-nowrap">New Users</span>
                        </div>
                    </div>
                    
                    {/* Dropdown - Responsive styling */}
                    <select 
                        className="text-base sm:text-xl bg-white border border-gray-300 hover:cursor-pointer rounded-lg px-3 py-2 sm:py-1 focus:outline-none appearance-none pr-8 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 w-full sm:w-auto"
                        value={selectedPeriod}
                        onChange={handlePeriodChange}
                    >
                        {Object.keys(chartDataMap).map((period) => (
                            <option key={period} value={period}>{period}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Chart Container - Responsive height */}
            <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentChartData}>
                        {/* Gradients remain the same */}
                        <defs>
                            <linearGradient id={TOTAL_USERS_AREA_ID} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={TOTAL_USERS_COLOR} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={TOTAL_USERS_COLOR} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={NEW_USERS_AREA_ID} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={NEW_USERS_COLOR} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={NEW_USERS_COLOR} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#A0AEC0' }}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={formatYAxisTick}
                            tick={{ fontSize: 10, fill: '#A0AEC0' }}
                            domain={[0, 'dataMax + 5000']}
                        />
                        
                        <Tooltip content={<CustomTooltip />} />
                        
                        <Area 
                            type="monotone" 
                            dataKey="totalUsers" 
                            stroke={TOTAL_USERS_COLOR} 
                            fillOpacity={1} 
                            fill={`url(#${TOTAL_USERS_AREA_ID})`} 
                            strokeWidth={2}
                            dot={{ r: 0 }}
                            activeDot={{ r: 4, fill: TOTAL_USERS_COLOR, stroke: 'white', strokeWidth: 2 }}
                        />
                        
                        <Area 
                            type="monotone" 
                            dataKey="newUsers" 
                            stroke={NEW_USERS_COLOR} 
                            fillOpacity={1} 
                            fill={`url(#${NEW_USERS_AREA_ID})`} 
                            strokeWidth={2}
                            dot={{ r: 0 }}
                            activeDot={{ r: 4, fill: NEW_USERS_COLOR, stroke: 'white', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminUsersChart;