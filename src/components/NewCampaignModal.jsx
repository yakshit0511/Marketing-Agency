import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { usePersistence } from '../hooks/usePersistence';
import { useToast } from '../contexts/ToastContext';

export default function NewCampaignModal({ onClose }) {
  const { addCampaign, addTask, teamMembers } = usePersistence();
  const { addToast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const [formData, setFormData] = useState({
    clientName: '',
    campaignName: '',
    type: 'Social Media',
    deadline: '',
    budget: '',
    status: 'Planning',
    owner: teamMembers[0]?.id || '',
    progress: 0
  });

  const [stagedTasks, setStagedTasks] = useState([]);

  const handleGenerateBrief = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || 'dummy';
      if (apiKey === 'dummy') {
        // Fallback mock if no API key is present
        await new Promise(r => setTimeout(r, 1500));
        setFormData(prev => ({
          ...prev,
          clientName: 'Generated Client',
          campaignName: 'AI Generated Campaign',
          type: 'Social Media',
          budget: 5000,
          deadline: '2026-12-31'
        }));
        setStagedTasks([
          { title: 'Define target audience', priority: 'High', estimatedDays: 2 },
          { title: 'Create content calendar', priority: 'Medium', estimatedDays: 3 }
        ]);
      } else {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: "You are a marketing project manager. Given client requirements, generate a structured campaign brief with: clientName, campaignName, type (Social Media/SEO/Paid Ads/Content), budget (number), deadline (YYYY-MM-DD), suggestedTasks (array of {title, priority (Low/Medium/High/Urgent), estimatedDays}). Return as JSON only without any markdown formatting.",
            messages: [{ role: 'user', content: aiPrompt }]
          })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const content = data.content[0].text;
        const parsed = JSON.parse(content);
        
        setFormData(prev => ({
          ...prev,
          clientName: parsed.clientName || prev.clientName,
          campaignName: parsed.campaignName || prev.campaignName,
          type: parsed.type || prev.type,
          budget: parsed.budget || prev.budget,
          deadline: parsed.deadline || prev.deadline
        }));
        
        if (parsed.suggestedTasks) {
          setStagedTasks(parsed.suggestedTasks);
        }
      }
      addToast('Brief generated successfully!');
    } catch (error) {
      console.error(error);
      addToast('AI Generation failed. Using fallback.', 'error');
      setFormData(prev => ({
        ...prev,
        campaignName: 'Fallback Campaign Name'
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `c${Date.now()}`;
    addCampaign({ ...formData, id: newId });
    
    stagedTasks.forEach(task => {
      addTask({
        campaignId: newId,
        title: task.title,
        priority: task.priority,
        status: 'Todo',
        assignee: formData.owner,
        dueDate: formData.deadline || '2026-12-31',
        description: ''
      });
    });

    addToast('Campaign saved');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1d27] rounded-2xl w-full max-w-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">New Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-accent font-semibold flex items-center text-sm"><Sparkles className="w-4 h-4 mr-2" /> AI Campaign Brief Generator</h3>
            </div>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Paste client requirements here (e.g. 'We need to launch a new product on Instagram...')"
              className="w-full bg-[#0f1117] border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent mb-3 min-h-[80px]"
            />
            <button 
              type="button"
              onClick={handleGenerateBrief}
              disabled={isGenerating || !aiPrompt.trim()}
              className="flex items-center px-4 py-2 bg-accent hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isGenerating ? 'Generating...' : 'Generate Brief'}
            </button>
          </div>

          <form id="campaignForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Client Name</label>
                <input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full bg-[#0f1117] border border-gray-800 rounded-lg p-2.5 text-white focus:border-accent focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Campaign Name</label>
                <input required type="text" value={formData.campaignName} onChange={e => setFormData({...formData, campaignName: e.target.value})} className="w-full bg-[#0f1117] border border-gray-800 rounded-lg p-2.5 text-white focus:border-accent focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#0f1117] border border-gray-800 rounded-lg p-2.5 text-white focus:border-accent focus:outline-none text-sm">
                  <option>Social Media</option>
                  <option>SEO</option>
                  <option>Paid Ads</option>
                  <option>Content</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Owner</label>
                <select value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} className="w-full bg-[#0f1117] border border-gray-800 rounded-lg p-2.5 text-white focus:border-accent focus:outline-none text-sm">
                  {teamMembers.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Deadline</label>
                <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full bg-[#0f1117] border border-gray-800 rounded-lg p-2.5 text-white focus:border-accent focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Budget ($)</label>
                <input required type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-[#0f1117] border border-gray-800 rounded-lg p-2.5 text-white focus:border-accent focus:outline-none text-sm" />
              </div>
            </div>
            
            {stagedTasks.length > 0 && (
              <div className="pt-4 border-t border-gray-800 mt-4">
                <h4 className="text-sm font-medium text-white mb-3">AI Suggested Tasks</h4>
                <div className="space-y-2">
                  {stagedTasks.map((t, idx) => (
                    <div key={idx} className="flex justify-between bg-white/5 p-2 rounded-lg text-sm text-gray-300">
                      <span>{t.title}</span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-800">{t.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
        
        <div className="p-6 border-t border-gray-800 flex justify-end space-x-3 bg-[#14161f]">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">Cancel</button>
          <button type="submit" form="campaignForm" className="px-4 py-2 bg-accent hover:bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg">Create Campaign</button>
        </div>
      </div>
    </div>
  );
}
