import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, UserPlus, Briefcase, Calendar, CheckSquare, LayoutGrid, Users, ClipboardList, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // States for new project and task
  const [newProject, setNewProject] = useState({ name: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '', project_id: '', due_date: '' });
  const [memberToProject, setMemberToProject] = useState({ projectId: '', userId: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        api.get('/projects'),
        api.get('/projects/users/all')
      ]);
      setProjects(projRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '' });
      fetchInitialData();
    } catch (err) { alert(err.response?.data?.message || 'Error creating project'); }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setNewTask({ title: '', description: '', assigned_to: '', project_id: '', due_date: '' });
      alert('Task created successfully!');
    } catch (err) { alert(err.response?.data?.message || 'Error creating task'); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${memberToProject.projectId}/members`, { userId: memberToProject.userId });
      alert('Member added successfully!');
    } catch (err) { alert(err.response?.data?.message || 'Error adding member'); }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <LayoutGrid className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-slate-800">Admin Command Center</h1>
        </div>
        <button 
          onClick={() => navigate('/admin/assignments')}
          className="flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 shadow-sm"
        >
          <Settings size={18} className="text-slate-400" />
          Manage Assignments
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Project Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <PlusCircle size={20} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Create New Project</h3>
          </div>
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Project Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g., Marketing Campaign Q3" 
                value={newProject.name} 
                onChange={(e) => setNewProject({ name: e.target.value })} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-sm"
            >
              <Briefcase size={18} />
              Create Project
            </button>
          </form>
        </section>

        {/* Add Member Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <UserPlus size={20} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Assign Member to Project</h3>
          </div>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Select Project</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  value={memberToProject.projectId} 
                  onChange={(e) => setMemberToProject({...memberToProject, projectId: e.target.value})}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Select User</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  value={memberToProject.userId} 
                  onChange={(e) => setMemberToProject({...memberToProject, userId: e.target.value})}
                  required
                >
                  <option value="">Select User</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-sm"
            >
              <Users size={18} />
              Add Member
            </button>
          </form>
        </section>

        {/* Create Task Section */}
        <section className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <ClipboardList size={20} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Create & Assign New Task</h3>
          </div>
          <form onSubmit={handleTaskSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Task Title</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g., Design Landing Page" 
                    value={newTask.title} 
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none min-h-[100px]"
                    placeholder="Provide details about the task..." 
                    value={newTask.description} 
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Assign to Project</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    value={newTask.project_id} 
                    onChange={(e) => setNewTask({...newTask, project_id: e.target.value})}
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Assign to Member</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    value={newTask.assigned_to} 
                    onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                    required
                  >
                    <option value="">Select Member</option>
                    {users.filter(u => u.role === 'member').map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      value={newTask.due_date} 
                      onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-sm mt-4"
            >
              <CheckSquare size={20} />
              Save and Assign Task
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
