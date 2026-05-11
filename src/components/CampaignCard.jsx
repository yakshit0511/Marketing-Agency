import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import { usePersistence } from '../hooks/usePersistence';

const STATUS_COLORS = {
  'Planning': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Delivered': 'bg-green-500/10 text-green-400 border-green-500/20'
};

export default function CampaignCard({ campaign, owner, onClick }) {
  const { tasks } = usePersistence();
  const campaignTasks = tasks.filter(t => t.campaignId === campaign.id);

  return (
    <div 
      onClick={onClick}
      className="bg-[#14161f] border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">{campaign.clientName}</p>
          <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">{campaign.campaignName}</h3>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[campaign.status]}`}>
          {campaign.status}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            {owner && (
              <div className="flex items-center space-x-2" title={owner.name}>
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px] font-bold">
                  {owner.avatarInitials}
                </div>
                <span>{owner.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{campaign.deadline}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">{campaign.progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div 
              className="bg-accent h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${campaign.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <div className="flex items-center space-x-1 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
          <Tag className="w-3 h-3" />
          <span>{campaign.type}</span>
        </div>
        
        <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {campaignTasks.length} Tasks
        </span>
      </div>
    </div>
  );
}
