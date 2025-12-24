import { Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Workflow {
  id: string;
  name: string;
  type: 'media' | 'finance' | 'space';
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  status: 'pending' | 'in_progress' | 'blocked' | 'completed';
  assignee: string;
}

const workflows: Workflow[] = [
  {
    id: '1',
    name: 'MTN Corporate Video',
    type: 'media',
    currentStep: 'Production',
    totalSteps: 6,
    completedSteps: 3,
    status: 'in_progress',
    assignee: 'Media Team',
  },
  {
    id: '2',
    name: 'Equipment Purchase',
    type: 'finance',
    currentStep: 'CEO Approval',
    totalSteps: 5,
    completedSteps: 3,
    status: 'pending',
    assignee: 'CEO',
  },
  {
    id: '3',
    name: 'Conference Room Booking',
    type: 'space',
    currentStep: 'Payment Pending',
    totalSteps: 4,
    completedSteps: 2,
    status: 'blocked',
    assignee: 'Admin',
  },
  {
    id: '4',
    name: 'Podcast Episode #45',
    type: 'media',
    currentStep: 'Delivery',
    totalSteps: 6,
    completedSteps: 5,
    status: 'in_progress',
    assignee: 'Media Team',
  },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-warning' },
  in_progress: { label: 'In Progress', icon: ArrowRight, color: 'text-info' },
  blocked: { label: 'Blocked', icon: AlertCircle, color: 'text-destructive' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-success' },
};

export function WorkflowStatus() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Active Workflows</h3>
          <p className="text-sm text-muted-foreground">Track progress across all processes</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {workflows.map((workflow) => {
          const status = statusConfig[workflow.status];
          const StatusIcon = status.icon;
          const progress = (workflow.completedSteps / workflow.totalSteps) * 100;

          return (
            <div
              key={workflow.id}
              className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{workflow.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {workflow.currentStep} • {workflow.assignee}
                  </p>
                </div>
                <div className={cn('flex items-center gap-1.5', status.color)}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{status.label}</span>
                </div>
              </div>

              <div className="relative">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Step {workflow.completedSteps} of {workflow.totalSteps}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
