
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
