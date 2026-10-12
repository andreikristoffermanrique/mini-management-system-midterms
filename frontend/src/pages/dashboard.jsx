import React from 'react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Records', value: '128', color: 'bg-indigo-500' },
    { label: 'Active Users', value: '42', color: 'bg-emerald-500' },
    { label: 'Pending Requests', value: '7', color: 'bg-amber-500' },
    { label: 'System Health', value: '99.9%', color: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-600 text-sm">Welcome back! Here is a summary of the current system metrics.</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-5 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">{stat.value}</p>
            </div>
            <div className={`w-3 h-10 rounded-full ${stat.color}`}></div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-slate-100 text-sm text-slate-600">
          <li className="py-3 flex justify-between items-center">
            <span>New record added to the management system database</span>
            <span className="text-xs text-slate-400">5 mins ago</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <span>User profile updated successfully</span>
            <span className="text-xs text-slate-400">1 hour ago</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <span>System backup routine executed</span>
            <span className="text-xs text-slate-400">3 hours ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
}