import { FileText, Users, Calendar, Video, DollarSign, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'client' | 'booking' | 'media' | 'payment' | 'document' | 'approval';
  title: string;
  description: string;
  time: string;
  status?: 'pending' | 'completed' | 'in_progress';
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Payment Received',
    description: 'Cameroon Tech Corp - Invoice #2024-089',
    time: '10 min ago',
    status: 'completed',
  },
  {
    id: '2',
    type: 'media',
    title: 'New Media Project',
    description: 'Corporate video for MTN Cameroon',
    time: '1 hour ago',
    status: 'in_progress',
  },
  {
    id: '3',
    type: 'booking',
    title: 'Space Reservation',
    description: 'Conference Room A - Dec 28, 2024',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: '4',
    type: 'client',
    title: 'New Client Registration',
    description: 'Startup Hub Africa joined',
    time: '3 hours ago',
    status: 'completed',
  },
  {
    id: '5',
    type: 'approval',
    title: 'Expense Approved',
    description: 'Equipment purchase - $2,500',
    time: '5 hours ago',
    status: 'completed',
  },
];

const iconMap = {
  client: Users,
  booking: Calendar,
  media: Video,
  payment: DollarSign,
  document: FileText,
  approval: CheckCircle,
};

const statusStyles = {
  pending: 'badge-warning',
  completed: 'badge-success',
  in_progress: 'badge-info',
};

export function RecentActivity() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest actions across all modules</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </h4>
                  {activity.status && (
                    <span className={cn(statusStyles[activity.status])}>
                      {activity.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
