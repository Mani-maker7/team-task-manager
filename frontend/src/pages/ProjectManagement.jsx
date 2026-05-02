import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Users, 
  Trash2, 
  Edit, 
  ChevronRight, 
  Search, 
  Filter, 
  ArrowLeft,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mgmtLoading, setMgmtLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProject) {
        handleSelectProject(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setMgmtLoading(true);
    try {
      const [membersRes, tasksRes] = await Promise.all([
        api.get(`/projects/${project.id}/members`),
        api.get(`/tasks/project/${project.id}`)
      ]);
      setMembers(membersRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error fetching project details');
    } finally {
      setMgmtLoading(false);
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member from the project?')) return;
    const url = `/projects/${selectedProject.id}/members/${userId}`;
    console.log(`Attempting to delete member: ${userId} via URL: ${url}`);
    try {
      const response = await api.delete(url);
      console.log('Delete response:', response.data);
      setMembers(members.filter(m => m.id !== userId));
    } catch (err) {
      console.error('Removal failed:', err);
      alert('Error removing member: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const deleteProject = async () => {
    if (!window.confirm('DANGER: This will delete the project and all its assignments. Continue?')) return;
    try {
      await api.delete(`/projects/${selectedProject.id}`);
      const newProjects = projects.filter(p => p.id !== selectedProject.id);
      setProjects(newProjects);
      if (newProjects.length > 0) {
        handleSelectProject(newProjects[0]);
      } else {
        setSelectedProject(null);
      }
    } catch (err) {
      alert('Error deleting project');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
             <h1 className="text-3xl font-bold text-slate-800">Project Assignments</h1>
             <p className="text-slate-500">View and manage project resource allocations</p>
          </div>
        </div>
        
        {selectedProject && (
          <button 
            onClick={deleteProject}
            className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-rose-100"
          >
            <Trash2 size={16} />
            Delete Entire Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Project List Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Your Projects</h3>
            <div className="space-y-2">
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-all ${
                    selectedProject?.id === p.id 
                    ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-50' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className={selectedProject?.id === p.id ? 'text-blue-200' : 'text-slate-400'} />
                    <span className="font-bold">{p.name}</span>
                  </div>
                  <ChevronRight size={16} className={selectedProject?.id === p.id ? 'opacity-100' : 'opacity-20'} />
                </button>
              ))}
              {projects.length === 0 && (
                <p className="text-center py-8 text-slate-400">No projects found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Management Detail Area */}
        <div className="lg:col-span-8">
          {!selectedProject ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center text-slate-400 h-full justify-center">
              <Users size={64} className="mb-4 opacity-10" />
              <p className="text-lg font-medium">Select a project to manage assignments</p>
            </div>
          ) : mgmtLoading ? (
            <div className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center h-full">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
               <p className="text-slate-500 font-medium">Loading assignments...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Project Members */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-purple-600" />
                    <h2 className="text-xl font-bold text-slate-800">Assigned Members</h2>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                    {members.length} Users
                  </span>
                </div>
                <div className="p-0">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {members.map(member => (
                        <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-bold text-slate-800">{member.name}</p>
                              <p className="text-xs text-slate-400">{member.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              member.role === 'admin' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button 
                              onClick={() => removeMember(member.id)}
                              className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                              title="Remove Member"
                             >
                               <X size={18} />
                             </button>
                          </td>
                        </tr>
                      ))}
                      {members.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-6 py-12 text-center text-slate-400 italic">
                            No members assigned to this project yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Project Tasks */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={20} className="text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-800">Project Tasks</h2>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    {tasks.length} Tasks
                  </span>
                </div>
                <div className="p-0">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                        <th className="px-6 py-4">Task Name</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Assignee</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {tasks.map(task => (
                        <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-800">{task.title}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              task.status === 'completed' ? 'bg-green-100 text-green-700' :
                              task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-medium text-slate-600">{task.assigned_name || 'Unassigned'}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-1">
                               <button 
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                                title="Delete Task"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                      {tasks.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                            No tasks created for this project yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
