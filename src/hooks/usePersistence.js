import { useState, useEffect } from 'react';
import { initialCampaigns, initialTasks, initialTeamMembers } from '../data/seedData';

const STORAGE_KEY = 'marketing_agency_data';

export const usePersistence = () => {
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    }
    
    return {
      campaigns: initialCampaigns,
      tasks: initialTasks,
      teamMembers: initialTeamMembers
    };
  });

  // Auto-save on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to localStorage', error);
    }
  }, [data]);

  const addCampaign = (campaign) => {
    const newId = campaign.id || `c${Date.now()}`;
    setData(prev => ({
      ...prev,
      campaigns: [...prev.campaigns, { ...campaign, id: newId }]
    }));
    return newId;
  };

  const updateCampaign = (id, updates) => {
    setData(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const addTask = (task) => {
    const newId = task.id || `t${Date.now()}`;
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: newId }]
    }));
    return newId;
  };

  const updateTask = (id, updates) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTask = (id) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  return {
    campaigns: data.campaigns,
    tasks: data.tasks,
    teamMembers: data.teamMembers,
    addCampaign,
    updateCampaign,
    addTask,
    updateTask,
    deleteTask
  };
};
