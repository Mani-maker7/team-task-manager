import React, { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle2, Clock, PlayCircle, Calendar, ClipboardCheck, AlertCircle, Users, Mail } from 'lucide-react';

const MemberDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projectMembers, setProjectMembers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchProjectMembers = async (projectIds) => {
    const memberData = { ...projectMembers };
    try {
      await Promise.all(
        projectIds.map(async (id) => {
          if (!memberData[id]) {
            const res = await api.get(`/projects/${id}/members`);
            memberData[id] = res.data;
          }
        })
      );
      setProjectMembers(memberData);
    } catch (err) {
      console.error('Error fetching project members:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      const loadedTasks = response.data;
      setTasks(loadedTasks);
      
      // Get unique project IDs and fetch their members
      const uniqueProjectIds = [...new Set(loadedTasks.map(t => t.project_id))];
      if (uniqueProjectIds.length > 0) {
        await fetchProjectMembers(uniqueProjectIds);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks(); // Refresh list
    } catch (err) {
      alert('Failed to update task status.');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { 
          color: 'bg-green-100 text-green-700 border-green-200', 
          icon: <CheckCircle2 size={16} />,
          label: 'Completed'
        };
      case 'in_progress':
        return { 
          color: 'bg-blue-100 text-blue-700 border-blue-200', 
          icon: <PlayCircle size={16} />,
          label: 'In Progress'
        };
      default:
        return { 
          color: 'bg-amber-100 text-amber-700 border-amber-200', 
          icon: <Clock size={16} />,
          label: 'Pending'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardCheck className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-slate-800">My Assigned Tasks</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map(task => {
            const statusConfig = getStatusConfig(task.status);
            return (
              <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">#{task.id}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{task.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="font-medium">Project: {task.project_name}</span>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2 h-10">
                    {task.description || "No description provided."}
                  </p>
                  
                  {/* Team Members Section */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Users size={14} />
                      Project Team
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                      {projectMembers[task.project_id]?.length > 0 ? (
                        projectMembers[task.project_id].map(member => (
                          <div key={member.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700">{member.name}</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                {member.email}
                              </span>
                            </div>
                            <a 
                              href={`mailto:${member.email}`} 
                              className="p-1.5 bg-white text-blue-600 rounded-md shadow-sm border border-slate-100 hover:bg-blue-50 transition-colors"
                              title={`Email ${member.name}`}
                            >
                              <Mail size={12} />
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">No other members discovered.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={14} />
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select 
                        className="text-xs font-medium bg-slate-50 border-none rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                        value={task.status} 
                        onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">Working</option>
                        <option value="completed">Done</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">You don't have any assigned tasks yet.</p>
            <p className="text-sm">When an admin assigns you a task, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
