
import * as React from "react";
import { 
  Search, 
  MousePointerClick, 
  FileText, 
  Share2, 
  BarChart,
  LucideIcon 
} from "lucide-react";
import { IconName } from "@/data/mockData";

// Map icon names to Lucide icon components
const iconMap: Record<IconName, LucideIcon> = {
  'search': Search,
  'mouse-pointer-click': MousePointerClick,
  'file-text': FileText,
  'share-2': Share2,
  'bar-chart': BarChart,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  className 
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon '${name}' not found in icon map`);
    return null;
  }
  
  return <IconComponent size={size} className={className} />;
};

export default Icon;
