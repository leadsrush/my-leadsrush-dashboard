
import { 
  Home, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  BarChart3, 
  CreditCard, 
  HelpCircle, 
  LayoutDashboard,
  Bell,
} from 'lucide-react';
import { NavItem } from './types';

// Navigation items for client dashboard
export const clientNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/client-dashboard',
    icon: Home,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FileText,
  },
  {
    title: 'Services',
    href: '/services',
    icon: LayoutDashboard,
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: CreditCard,
  },
  {
    title: 'Support',
    href: '/support',
    icon: HelpCircle,
  },
];

// Navigation items for the team members
export const teamNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/team-dashboard',
    icon: Home,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FileText,
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
];

// Client management items for project managers and admins
export const clientManagementItems: NavItem[] = [
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
  },
];

// Admin-specific navigation items
export const adminNavItems: NavItem[] = [
  {
    title: 'Team',
    href: '/team',
    icon: Users,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Manage Services',
    href: '/admin/services',
    icon: LayoutDashboard,
  },
  {
    title: 'Invoices',
    href: '/admin/invoices',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];
