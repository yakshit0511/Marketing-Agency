import React, { useState } from 'react';
import { X, CheckSquare, Plus, Clock, AlertCircle } from 'lucide-react';
import { usePersistence } from '../hooks/usePersistence';
import { useToast } from '../contexts/ToastContext';

const PRIORITY_COLORS = {
  'Urgent': 'bg-red-500/20 text-red-400',
  'High': 'bg-orange-500/20 text-orange-400',
  'Medium': 'bg-blue-500/20 text-blue-400',
  'Low': 'bg-gray-500/20 text-gray-400'
};

const PRIORITY_WEIGHT = {
  'Urgent': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1
};

export default function TaskPanel({ campaignId, onClose }) {
  const { tasks, teamMembers, updateTask, addTask } = usePersistence();
  const { addToast } = useToast();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    assignee: teamMembers[0]?.id || '',
    dueDate: '',
    priority: 'Medium'
  });

  const campaignTasks = tasks.filter(t => t.campaignId === campaignId);
  
  // Sort: Urgent first, then due date
  const sortedTasks = [...campaignTasks].sort((a, b) => {
    if (PRIORITY_WEIGHT[b.priority] !== PRIORITY_WEIGHT[a.priority]) {
      return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const handleToggleDone = (task) => {
    const newStatus = task.status === 'Done' ? 'Todo' : 'Done';
    updateTask(task.id, { status: newStatus });
    addToast(`Task marked as ${newStatus}`);
  };

  const handleStatusChange = (task, status) => {
    updateTask(task.id, { status });
    addToast('Status updated');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    addTask({
      ...newTask,
      campaignId,
      status: 'Todo',
      description: ''
    });
    addToast('Task created');
    setShowAddForm(false);
    setNewTask({ title: '', assignee: teamMembers[0]?.id || '', dueDate: '', priority: 'Medium' });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    return dueDate < today;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[500px] bg-[#14161f] border-l border-gray-800 shadow-2xl z-50 flex flex-col transition-transform transform duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center">
            <CheckSquare className="w-5 h-5 mr-2 text-accent" /> Tasks
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              No tasks for this campaign yet.
            </div>
          ) : (
            sortedTasks.map(task => {
              const assignee = teamMembers.find(tm => tm.id === task.assignee);
              const overdue = isOverdue(task.dueDate) && task.status !== 'Done';
              
              return (
                <div key={task.id} className={`bg-[#1a1d27] border ${overdue ? 'border-l-4 border-red-500 border-y-gray-800 border-r-gray-800' : 'border-gray-800'} rounded-xl p-4 flex gap-4 items-start`}>
                  <input 
                    type="checkbox" 
                    checked={task.status === 'Done'}
                    onChange={() => handleToggleDone(task)}
                    className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-900 text-accent focus:ring-accent focus:ring-offset-gray-900"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === 'Done' ? 'text-gray-500 line-through' : 'text-gray-200'} mb-2`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      {assignee && (
                        <div className="flex items-center space-x-1" title={assignee.name}>
                          <div className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[9px] font-bold">
                            {assignee.avatarInitials}
                          </div>
                          <span>{assignee.name}</span>
                        </div>
                      )}
                      
                      <div className={`flex items-center space-x-1 ${overdue ? 'text-red-400' : ''}`}>
                        {overdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{task.dueDate}</span>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  
                  <select 
                    value={task.status} 
                    onChange={e => handleStatusChange(task, e.target.value)}
                    className="bg-[#0f1117] border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-accent"
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Done</option>
                  </select>
                </div>
              );
            })
          )}
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#1a1d27]">
          {!showAddForm ? (
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center py-3 border border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Task
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="space-y-3 bg-[#0f1117] p-4 rounded-xl border border-gray-800">
              <input 
                autoFocus
                required
                type="text" 
                placeholder="Task title" 
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                className="w-full bg-transparent border-b border-gray-800 px-2 py-2 text-sm text-white focus:outline-none focus:border-accent"
              />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Assignee</label>
                  <select value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})} className="w-full bg-[#1a1d27] border border-gray-800 rounded p-2 text-xs text-white">
                    {teamMembers.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Due Date</label>
                  <input required type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} className="w-full bg-[#1a1d27] border border-gray-800 rounded p-2 text-xs text-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full bg-[#1a1d27] border border-gray-800 rounded p-2 text-xs text-white">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-accent hover:bg-indigo-600 text-white text-xs font-medium rounded">Save Task</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
