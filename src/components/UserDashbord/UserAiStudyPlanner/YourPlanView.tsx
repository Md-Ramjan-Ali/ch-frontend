import React from 'react';
import {   Zap,  } from 'lucide-react';
import { GoalData } from './AIStudyPlanner';
import { GiBookmarklet } from "react-icons/gi";
import { IoSparklesSharp } from 'react-icons/io5';

// Stat Card
const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-xl flex-1 min-w-[150px] text-center">
    <p className="text-2xl font-bold text-indigo-600 mb-1">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

// Daily Task Item
const DailyTaskItem: React.FC<{ time: string; task: string }> = ({ time, task }) => (
  <div className="flex items-center justify-between py-4 bg-white p-4 rounded-xl border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-4">
      <GiBookmarklet className="h-8 w-8  text-[#2C3E50]" />
      <div>
        <p className="font-medium text-gray-800">{task}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
    <button className="flex cursor-pointer items-center space-x-1 px-4 py-2 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
      <span>Start</span>
      <span className="ml-1 text-xl leading-none">›</span>
    </button>
  </div>
);

// Weekly Goal Item
const WeeklyGoalItem: React.FC<{ goal: string }> = ({ goal }) => (
  <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-xl flex-1 min-w-[300px]">
    <Zap className="h-5 w-5 text-green-600" />
    <p className="text-sm text-green-800 font-medium">{goal}</p>
  </div>
);

type YourPlanProps = { goalData: GoalData };

export const YourPlanView: React.FC<YourPlanProps> = ({ goalData }) => (
  <div className="space-y-10 ">
    {/* Header */}
    <div className="space-y-4 bg-white py-9 px-6 rounded-xl shadow-sm">
      <div className="flex items-start space-x-2">
        <IoSparklesSharp className="h-6 w-6 text-indigo-500 mt-0.5" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Personalized {goalData.focusAreas.join(', ')} Study Plan
          </h2>
          <p className="text-sm text-gray-500">AI-generated plan to help you {goalData.target.toLowerCase()}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-between">
        <StatCard value={`${goalData.dailyTime} / Day`} label="Daily Study Time" />
        <StatCard value={`${goalData.daysPerWeek} Days`} label="Per Week" />
        <StatCard value={`${goalData.focusAreas.length} Focus Areas`} label="Focus Areas" />
        <StatCard value="4 Objectives" label="Weekly Goals" />
      </div>
    </div>

    <hr className="border-gray-100 " />

    {/* Suggested Daily Plan */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Suggested Daily Plan</h3>
      <p className="text-sm text-gray-500">Flashcards, Practice Sets, and Quizzes</p>
      <div className="space-y-2 ">
        {[...Array(5)].map((_, i) => (
          <DailyTaskItem key={i} time="15 min" task="Review Essential Vocabulary" />
        ))}
      </div>
    </div>

    <hr className="border-gray-100 " />

    {/* Suggested Weekly Plan */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Suggested Weekly Plan</h3>
      <p className="text-sm text-gray-500">Grammar lessons, Vocabulary review, Listening practice</p>
      <div className="grid md:grid-cols-2 gap-4">
        <WeeklyGoalItem goal="Complete 80% of daily tasks" />
        <WeeklyGoalItem goal="Review all flashcards at least twice" />
        <WeeklyGoalItem goal="Practice speaking for 3 sessions" />
        <WeeklyGoalItem goal="Listen to content for 2 hours total" />
      </div>
    </div>
  </div>
);














 