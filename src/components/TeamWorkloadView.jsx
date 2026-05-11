import React from 'react';
import { usePersistence } from '../hooks/usePersistence';

const getCapacityColor = (percent) => {
  if (percent <= 60) return 'bg-green-500';
  if (percent <= 85) return 'bg-amber-500';
  return 'bg-red-500';
};

export default function TeamWorkloadView() {
  const { teamMembers, tasks, campaigns } = usePersistence();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => {
          const memberTasks = tasks.filter(t => t.assignee === member.id && t.status !== 'Done');
          const activeTaskCount = memberTasks.length;
          const capacityFill = Math.min((activeTaskCount / member.capacity) * 100, 100);
          const isOverloaded = activeTaskCount > member.capacity;
          
          const topTasks = memberTasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3);

          return (
            <div key={member.id} className="bg-[#14161f] border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg font-bold">
                    {member.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>
                {isOverloaded && (
                  <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded">
                    Overloaded
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-white font-medium">{activeTaskCount} / {member.capacity} tasks</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getCapacityColor(capacityFill)}`}
                    style={{ width: `${capacityFill}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Top Priorities</h4>
                {topTasks.length === 0 ? (
                  <p className="text-sm text-gray-500">No active tasks.</p>
                ) : (
                  <div className="space-y-3">
                    {topTasks.map(task => {
                      const campaign = campaigns.find(c => c.id === task.campaignId);
                      return (
                        <div key={task.id} className="bg-[#1a1d27] p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-200 mb-1">{task.title}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 truncate max-w-[150px]">
                              {campaign?.campaignName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded">
                              Due: {task.dueDate}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
