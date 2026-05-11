import React, { useState } from 'react';
import { usePersistence } from '../hooks/usePersistence';
import CampaignCard from './CampaignCard';
import TaskPanel from './TaskPanel';

const FILTERS = ['All', 'Planning', 'In Progress', 'Review', 'Delivered'];

export default function CampaignsView({ searchQuery }) {
  const { campaigns, teamMembers } = usePersistence();
  const [filter, setFilter] = useState('All');
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesSearch = !searchQuery || 
                          c.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Filter Bar */}
      <div className="flex space-x-2 border-b border-gray-800 pb-4 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-20 bg-[#14161f] rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-lg">No campaigns found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => {
            const owner = teamMembers.find(tm => tm.id === campaign.owner);
            return (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                owner={owner}
                onClick={() => setSelectedCampaignId(campaign.id)}
              />
            );
          })}
        </div>
      )}

      {selectedCampaignId && (
        <TaskPanel 
          campaignId={selectedCampaignId} 
          onClose={() => setSelectedCampaignId(null)} 
        />
      )}
    </div>
  );
}
