
// Define types
export type UserRole = 'admin' | 'project_manager' | 'team_member' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  projectManagerId: string;
  teamMemberIds: string[];
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  progress: number;
  tasks: Task[];
  serviceIds: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  dueDate?: string;
}

// Changed the icon type from string to a specific set of Lucide icon names
export type IconName = 'search' | 'mouse-pointer-click' | 'file-text' | 'share-2' | 'bar-chart';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: IconName; // Using the specific icon type
  features: string[];
  price?: number;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string | null;
  projectId: string | null;
  content: string;
  timestamp: string;
  read: boolean;
}

// Mock data
export const users: User[] = [
  {
    id: 'admin1',
    name: 'Alex Morgan',
    email: 'alex@leadsrush.com',
    role: 'admin',
    avatar: '/avatars/alex.jpg',
    active: true
  },
  {
    id: 'pm1',
    name: 'Jamie Reynolds',
    email: 'jamie@leadsrush.com',
    role: 'project_manager',
    avatar: '/avatars/jamie.jpg',
    active: true
  },
  {
    id: 'team1',
    name: 'Casey Williams',
    email: 'casey@leadsrush.com',
    role: 'team_member',
    avatar: '/avatars/casey.jpg',
    active: true
  },
  {
    id: 'client1',
    name: 'Taylor Smith',
    email: 'taylor@client.com',
    role: 'client',
    avatar: '/avatars/taylor.jpg',
    active: true
  },
  {
    id: 'client2',
    name: 'Jordan Lee',
    email: 'jordan@nexustech.com',
    role: 'client',
    avatar: '/avatars/jordan.jpg',
    active: true
  },
  {
    id: 'client3',
    name: 'Riley Johnson',
    email: 'riley@stellarbrands.com',
    role: 'client',
    avatar: '/avatars/riley.jpg', 
    active: false
  }
];

export const services: Service[] = [
  {
    id: 'seo',
    name: 'SEO Optimization',
    description: 'Improve your search engine rankings and drive organic traffic',
    icon: 'search',
    features: [
      'Keyword research and analysis',
      'On-page optimization',
      'Technical SEO audits',
      'Link building strategies'
    ]
  },
  {
    id: 'ppc',
    name: 'PPC Campaigns',
    description: 'Create and manage effective paid advertising campaigns',
    icon: 'mouse-pointer-click',
    features: [
      'Campaign strategy and setup',
      'Ad creation and optimization',
      'Bid management',
      'Performance tracking'
    ]
  },
  {
    id: 'content',
    name: 'Content Marketing',
    description: 'Develop engaging content that drives engagement and conversions',
    icon: 'file-text',
    features: [
      'Content strategy development',
      'Blog and article creation',
      'Email marketing campaigns',
      'Social media content'
    ]
  },
  {
    id: 'social',
    name: 'Social Media Marketing',
    description: 'Build your brand presence across social platforms',
    icon: 'share-2',
    features: [
      'Platform strategy',
      'Content creation and scheduling',
      'Community management',
      'Performance analysis'
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Reporting',
    description: 'Track, analyze, and optimize your marketing performance',
    icon: 'bar-chart',
    features: [
      'Custom dashboard setup',
      'Regular performance reports',
      'Data analysis and insights',
      'Conversion tracking'
    ]
  }
];

export const projects: Project[] = [
  {
    id: 'proj1',
    name: 'Website Redesign & SEO',
    description: 'Complete website overhaul with focus on SEO performance and conversion optimization',
    clientId: 'client1',
    projectManagerId: 'pm1',
    teamMemberIds: ['team1'],
    status: 'in_progress',
    startDate: '2023-11-15',
    progress: 60,
    tasks: [
      {
        id: 'task1',
        title: 'Keyword Research',
        description: 'Identify primary and secondary keywords for targeting',
        assigneeId: 'team1',
        status: 'completed',
        dueDate: '2023-11-30'
      },
      {
        id: 'task2',
        title: 'Content Strategy',
        description: 'Develop content plan based on keyword research',
        assigneeId: 'team1',
        status: 'in_progress',
        dueDate: '2023-12-15'
      },
      {
        id: 'task3',
        title: 'Technical SEO Audit',
        description: 'Complete technical audit and implement recommendations',
        assigneeId: 'team1',
        status: 'todo',
        dueDate: '2023-12-30'
      }
    ],
    serviceIds: ['seo', 'content']
  },
  {
    id: 'proj2',
    name: 'Q1 Marketing Campaign',
    description: 'Integrated marketing campaign across digital channels to promote new product launch',
    clientId: 'client2',
    projectManagerId: 'pm1',
    teamMemberIds: ['team1'],
    status: 'planning',
    startDate: '2024-01-01',
    progress: 20,
    tasks: [
      {
        id: 'task4',
        title: 'Campaign Strategy',
        description: 'Define campaign goals, audience, and channels',
        assigneeId: 'pm1',
        status: 'in_progress',
        dueDate: '2023-12-15'
      },
      {
        id: 'task5',
        title: 'Creative Development',
        description: 'Create campaign assets and messaging',
        assigneeId: 'team1',
        status: 'todo',
        dueDate: '2023-12-30'
      }
    ],
    serviceIds: ['ppc', 'social', 'content']
  }
];

export const messages: Message[] = [
  {
    id: 'msg1',
    senderId: 'client1',
    recipientId: 'pm1',
    projectId: 'proj1',
    content: 'Hi Jamie, I was wondering if we could discuss the latest keyword research findings?',
    timestamp: '2023-12-01T09:30:00Z',
    read: true
  },
  {
    id: 'msg2',
    senderId: 'pm1',
    recipientId: 'client1',
    projectId: 'proj1',
    content: 'Of course, Taylor! I can set up a call for tomorrow at 2pm if that works for you?',
    timestamp: '2023-12-01T10:15:00Z',
    read: true
  },
  {
    id: 'msg3',
    senderId: 'client1',
    recipientId: 'pm1',
    projectId: 'proj1',
    content: 'That sounds perfect. Looking forward to it!',
    timestamp: '2023-12-01T10:20:00Z',
    read: true
  },
  {
    id: 'msg4',
    senderId: 'client2',
    recipientId: 'pm1',
    projectId: 'proj2',
    content: "I have some ideas for the Q1 campaign that I'd like to share with the team.",
    timestamp: '2023-12-02T11:45:00Z',
    read: false
  }
];

// Helper functions to work with the mock data
export const getCurrentUser = () => {
  // For demo purposes, we'll return the admin user
  return users.find(user => user.id === 'admin1');
};

export const getProjectsByClient = (clientId: string) => {
  return projects.filter(project => project.clientId === clientId);
};

export const getProjectsByTeamMember = (userId: string) => {
  return projects.filter(project => 
    project.teamMemberIds.includes(userId) || 
    project.projectManagerId === userId
  );
};

export const getMessagesByUser = (userId: string) => {
  return messages.filter(message => 
    message.senderId === userId || 
    message.recipientId === userId
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getUnreadMessageCount = (userId: string) => {
  return messages.filter(message => 
    message.recipientId === userId && 
    !message.read
  ).length;
};

export const getProjectById = (projectId: string) => {
  return projects.find(project => project.id === projectId);
};

export const getUserById = (userId: string) => {
  return users.find(user => user.id === userId);
};

export const getServiceById = (serviceId: string) => {
  return services.find(service => service.id === serviceId);
};
