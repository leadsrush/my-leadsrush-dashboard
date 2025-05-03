
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProjectStatus } from '@/data/mockData';

interface StatusBadgeProps {
  status: ProjectStatus | 'todo' | 'in_progress' | 'review' | 'completed' | 'draft' | 'sent' | 'paid' | 'overdue';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    // Project statuses
    planning: {
      label: 'Planning',
      variant: 'outline' as const,
      className: 'border-blue-300 text-blue-700 bg-blue-50'
    },
    todo: {
      label: 'To Do',
      variant: 'outline' as const,
      className: 'border-gray-300 text-gray-700 bg-gray-50'
    },
    in_progress: {
      label: 'In Progress',
      variant: 'outline' as const,
      className: 'border-yellow-300 text-yellow-700 bg-yellow-50'
    },
    review: {
      label: 'Review',
      variant: 'outline' as const,
      className: 'border-purple-300 text-purple-700 bg-purple-50'
    },
    completed: {
      label: 'Completed',
      variant: 'outline' as const,
      className: 'border-green-300 text-green-700 bg-green-50'
    },
    // Invoice statuses
    draft: {
      label: 'Draft',
      variant: 'outline' as const,
      className: 'border-gray-300 text-gray-700 bg-gray-50'
    },
    sent: {
      label: 'Sent',
      variant: 'outline' as const,
      className: 'border-blue-300 text-blue-700 bg-blue-50'
    },
    paid: {
      label: 'Paid',
      variant: 'outline' as const, 
      className: 'border-green-300 text-green-700 bg-green-50'
    },
    overdue: {
      label: 'Overdue',
      variant: 'outline' as const,
      className: 'border-red-300 text-red-700 bg-red-50'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.todo;

  return (
    <Badge 
      variant={config.variant} 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
