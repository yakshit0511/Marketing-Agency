export const initialTeamMembers = [
  { id: 'tm1', name: 'Alex Johnson', role: 'Account Manager', avatarInitials: 'AJ', capacity: 15 },
  { id: 'tm2', name: 'Sarah Smith', role: 'Designer', avatarInitials: 'SS', capacity: 10 },
  { id: 'tm3', name: 'Mike Brown', role: 'Copywriter', avatarInitials: 'MB', capacity: 12 },
  { id: 'tm4', name: 'Emily Davis', role: 'SEO Specialist', avatarInitials: 'ED', capacity: 8 },
  { id: 'tm5', name: 'Chris Wilson', role: 'Designer', avatarInitials: 'CW', capacity: 10 },
  { id: 'tm6', name: 'Jessica Taylor', role: 'Account Manager', avatarInitials: 'JT', capacity: 15 }
];

export const initialCampaigns = [
  { id: 'c1', clientName: 'TechCorp', campaignName: 'Q3 Product Launch', type: 'Social Media', status: 'In Progress', owner: 'tm1', deadline: '2026-08-15', progress: 45, budget: 15000 },
  { id: 'c2', clientName: 'GreenLife', campaignName: 'Organic Traffic Boost', type: 'SEO', status: 'Planning', owner: 'tm4', deadline: '2026-10-01', progress: 10, budget: 8000 },
  { id: 'c3', clientName: 'FashionHub', campaignName: 'Summer Sale', type: 'Paid Ads', status: 'In Progress', owner: 'tm6', deadline: '2026-06-30', progress: 75, budget: 25000 },
  { id: 'c4', clientName: 'EduTech', campaignName: 'Back to School Blog Series', type: 'Content', status: 'Review', owner: 'tm3', deadline: '2026-07-20', progress: 90, budget: 5000 },
  { id: 'c5', clientName: 'FitApp', campaignName: 'App Install Campaign', type: 'Paid Ads', status: 'Delivered', owner: 'tm1', deadline: '2026-04-30', progress: 100, budget: 30000 },
  { id: 'c6', clientName: 'HomeDecor', campaignName: 'Pinterest Inspiration', type: 'Social Media', status: 'Planning', owner: 'tm2', deadline: '2026-09-10', progress: 0, budget: 12000 }
];

export const initialTasks = [
  // Campaign 1: TechCorp Q3 Product Launch
  { id: 't1', campaignId: 'c1', title: 'Design Instagram graphics', assignee: 'tm2', dueDate: '2026-06-15', priority: 'High', status: 'In Progress', description: 'Create a series of 5 Instagram posts highlighting the new features.' },
  { id: 't2', campaignId: 'c1', title: 'Write social media copy', assignee: 'tm3', dueDate: '2026-06-18', priority: 'Medium', status: 'Todo', description: 'Draft captions and hashtags for the Instagram graphics.' },
  { id: 't3', campaignId: 'c1', title: 'Schedule posts', assignee: 'tm1', dueDate: '2026-06-20', priority: 'Low', status: 'Todo', description: 'Load the approved content into the scheduling tool.' },
  
  // Campaign 2: GreenLife Organic Traffic Boost
  { id: 't4', campaignId: 'c2', title: 'Keyword research', assignee: 'tm4', dueDate: '2026-06-10', priority: 'High', status: 'Done', description: 'Identify high-volume, low-competition keywords in the eco-friendly niche.' },
  { id: 't5', campaignId: 'c2', title: 'Technical SEO audit', assignee: 'tm4', dueDate: '2026-06-25', priority: 'Urgent', status: 'In Progress', description: 'Analyze website speed, mobile-friendliness, and crawl errors.' },
  
  // Campaign 3: FashionHub Summer Sale
  { id: 't6', campaignId: 'c3', title: 'Set up Google Ads campaign', assignee: 'tm6', dueDate: '2026-06-05', priority: 'Urgent', status: 'Done', description: 'Configure targeting, budgets, and ad groups for the summer sale.' },
  { id: 't7', campaignId: 'c3', title: 'Design banner ads', assignee: 'tm5', dueDate: '2026-06-10', priority: 'High', status: 'Review', description: 'Create responsive display banners in various sizes.' },
  { id: 't8', campaignId: 'c3', title: 'Write ad copy variations', assignee: 'tm3', dueDate: '2026-06-08', priority: 'Medium', status: 'Done', description: 'Draft 3 different headlines and descriptions for A/B testing.' },
  { id: 't9', campaignId: 'c3', title: 'Monitor ad performance', assignee: 'tm6', dueDate: '2026-06-30', priority: 'Medium', status: 'In Progress', description: 'Daily check-ins on CTR and conversions.' },
  
  // Campaign 4: EduTech Back to School Blog Series
  { id: 't10', campaignId: 'c4', title: 'Draft "Top Study Tips" article', assignee: 'tm3', dueDate: '2026-06-20', priority: 'High', status: 'Review', description: 'Write a 1500-word SEO-optimized blog post.' },
  { id: 't11', campaignId: 'c4', title: 'Create article graphics', assignee: 'tm2', dueDate: '2026-06-22', priority: 'Medium', status: 'Todo', description: 'Design header image and infographics for the blog post.' },
  { id: 't12', campaignId: 'c4', title: 'Proofread and format', assignee: 'tm1', dueDate: '2026-06-25', priority: 'Low', status: 'Todo', description: 'Final review and WordPress formatting before publishing.' },
  
  // Campaign 5: FitApp App Install Campaign
  { id: 't13', campaignId: 'c5', title: 'Final performance report', assignee: 'tm1', dueDate: '2026-05-05', priority: 'Medium', status: 'Done', description: 'Compile ROAS and cost-per-install metrics for the client.' },
  
  // Campaign 6: HomeDecor Pinterest Inspiration
  { id: 't14', campaignId: 'c6', title: 'Create Pinterest mood board', assignee: 'tm5', dueDate: '2026-07-15', priority: 'Medium', status: 'Todo', description: 'Curate a visually appealing mood board for Q4 trends.' },
  { id: 't15', campaignId: 'c6', title: 'Pin scheduling strategy', assignee: 'tm6', dueDate: '2026-07-20', priority: 'High', status: 'Todo', description: 'Determine the best times and frequency for pinning content.' }
];
