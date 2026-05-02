import React, { useState, useEffect } from 'react';
import api from '../api';
import { LayoutDashboard, CheckCircle2, Clock, PlayCircle, BarChart3, AlertTriangle, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, in_progress: 0 });
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, overdueRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/dashboard/overdue')
      ]);
      setStats(statsRes.data);
      setOverdue(overdueRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Tasks', value: stats.total || 0, icon: <BarChart3 size={20} />, color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Pending', value: stats.pending || 0, icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'In Progress', value: stats.in_progress || 0, icon: <PlayCircle size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: stats.completed || 0, icon: <CheckCircle2 size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-slate-800">Overview Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-rose-500" size={20} />
            <h2 className="text-xl font-bold text-slate-800">Overdue Tasks</h2>
          </div>
          {overdue.length > 0 && (
            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-rose-200">
              {overdue.length} Tasks Delayed
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          {overdue.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-50">
                  <th className="px-6 py-4">Task Name</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {overdue.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{task.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {task.project_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-rose-600 font-medium">
                        <Calendar size={14} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <CheckCircle2 size={48} className="mb-4 opacity-10" />
              <p className="text-lg font-medium">Great job! No overdue tasks.</p>
              <p className="text-sm">Everything is running according to plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
