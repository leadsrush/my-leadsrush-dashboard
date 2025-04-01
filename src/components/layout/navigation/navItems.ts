
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings, 
  FolderKanban,
  FileText,
  Briefcase,
  PackageOpen
} from 'lucide-react';
import { NavItem } from './types';

// Client sidebar navigation items
export const clientNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/client-dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare
  },
  {
    title: 'Services',
    href: '/services',
    icon: PackageOpen
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: FileText
  },
];

// Team sidebar navigation items
export const teamNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/team-dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare
  },
];

// Admin sidebar navigation items
export const adminNavItems: NavItem[] = [
  {
    title: 'Team',
    href: '/team',
    icon: Users
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: PackageOpen
  },
  {
    title: 'Invoices',
    href: '/admin/invoices',
    icon: FileText
  },
];

// Client management items for admin and project manager
export const clientManagementItems: NavItem[] = [
  {
    title: 'Clients',
    href: '/clients',
    icon: Briefcase
  },
];

// Settings navigation item (common for all roles)
export const settingsNavItem: NavItem = {
  title: 'Settings',
  href: '/settings',
  icon: Settings
};
