import React, { useState } from 'react';
import { usePersistence } from '../hooks/usePersistence';

const STATUS_COLORS = {
  'Planning': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-50 text-blue-600',
  'Review': 'bg-amber-50 text-amber-600',
  'Delivered': 'bg-green-50 text-green-600'
};

const CircularProgress = ({ progress }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="transform -rotate-90 w-16 h-16">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-indigo-600 transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-bold text-gray-800">{progress}%</span>
    </div>
  );
};

export default function ClientDashboardView({ searchQuery }) {
  const { campaigns, tasks } = usePersistence();
  const [selectedClient, setSelectedClient] = useState('All');

  const clients = ['All', ...new Set(campaigns.map(c => c.clientName))];
  
  const filteredCampaigns = campaigns.filter(c => {
    const matchesClient = selectedClient === 'All' || c.clientName === selectedClient;
    const matchesSearch = !searchQuery || 
                          c.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClient && matchesSearch;
  });

  return (
    <div className="min-h-full bg-[#fafafa] text-gray-900 rounded-xl p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Client Portal</h2>
            <p className="text-gray-500 text-sm mt-1">Real-time status of your marketing campaigns</p>
          </div>
          
          <select 
            value={selectedClient} 
            onChange={(e) => setSelectedClient(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {clients.map(c => <option key={c} value={c}>{c === 'All' ? 'All Clients' : c}</option>)}
          </select>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500">No campaigns found for the selected client.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCampaigns.map(campaign => {
              const campaignTasks = tasks.filter(t => t.campaignId === campaign.id);
              
              // Simulate start date 30 days before deadline
              const deadlineDate = new Date(campaign.deadline);
              const startDate = new Date(deadlineDate);
              startDate.setDate(startDate.getDate() - 30);
              const today = new Date();
              
              const totalDuration = deadlineDate - startDate;
              const elapsed = today - startDate;
              const timeProgress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

              return (
                <div key={campaign.id} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                      <p className="text-sm font-semibold text-indigo-600 mb-1 tracking-wide uppercase">{campaign.clientName}</p>
                      <h3 className="text-2xl font-bold text-gray-900">{campaign.campaignName}</h3>
                      <p className="text-sm text-gray-500 mt-1">{campaign.type} Campaign</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[campaign.status]}`}>
                          {campaign.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-2">Target: {campaign.deadline}</p>
                      </div>
                      <CircularProgress progress={campaign.progress} />
                    </div>
                  </div>

                  {/* Visual Timeline */}
                  <div className="mb-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500 font-medium mb-2">
                      <span>Start: {startDate.toLocaleDateString()}</span>
                      <span>Deadline: {deadlineDate.toLocaleDateString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 relative">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${timeProgress}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 h-4 w-1 bg-indigo-900 -mt-1 rounded z-10 shadow-sm" 
                        style={{ left: `calc(${timeProgress}% - 2px)` }}
                        title="Today"
                      ></div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Key Deliverables</h4>
                    {campaignTasks.length === 0 ? (
                      <p className="text-sm text-gray-500">No deliverables scheduled yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {campaignTasks.map(task => (
                          <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                            <span className={`text-sm ${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                              {task.title}
                            </span>
                            <span className="text-xs font-semibold text-gray-500">
                              {task.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 text-right text-xs text-gray-400">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
