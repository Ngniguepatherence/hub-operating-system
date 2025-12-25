import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Filter, Calendar, User, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { usePermissions } from '@/hooks/usePermissions';
import { AddProjectDialog } from '@/components/dialogs/AddProjectDialog';
import { toast } from 'sonner';

const typeConfig = {
  video: { emoji: '🎬', color: 'text-info' },
  audio: { emoji: '🎵', color: 'text-success' },
  podcast: { emoji: '🎙️', color: 'text-warning' },
};

const statusConfig = {
  briefing: { label: 'Briefing', class: 'badge-muted' },
  quote: { label: 'Quote Pending', class: 'badge-warning' },
  production: { label: 'In Production', class: 'badge-info' },
  review: { label: 'Client Review', class: 'badge-warning' },
  delivery: { label: 'Ready for Delivery', class: 'badge-success' },
  completed: { label: 'Completed', class: 'badge-success' },
};

const workflowSteps = ['Client Request', 'Quote', 'Approval', 'Deposit', 'Production', 'Delivery', 'Invoice', 'Archive'];

export default function Media() {
  const { projects, advanceProjectStatus } = useAppStore();
  const { canManage } = usePermissions();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const handleAdvanceStatus = (projectId: string) => {
    if (!canManage('media')) {
      toast.error('You do not have permission to manage projects');
      return;
    }
    advanceProjectStatus(projectId);
  };

  const activeProjects = projects.filter(p => p.status !== 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <DashboardLayout title="Media Production" subtitle="Audio, video & podcast management">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-3">
          <button className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter by Type
          </button>
        </div>
        {canManage('media') && (
          <button 
            onClick={() => setProjectDialogOpen(true)}
            className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Active Projects</p>
          <p className="text-2xl font-bold text-foreground mt-1">{activeProjects}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Total Budget</p>
          <p className="text-2xl font-bold text-foreground mt-1">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Avg. Completion Time</p>
          <p className="text-2xl font-bold text-foreground mt-1">12 days</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Due This Week</p>
          <p className="text-2xl font-bold text-warning mt-1">3 projects</p>
        </div>
      </div>

      <div className="glass-card p-4 md:p-6 mb-6 overflow-x-auto">
        <h3 className="font-semibold text-foreground mb-4">Media Production Workflow</h3>
        <div className="flex items-center justify-start md:justify-between min-w-max md:min-w-0 pb-2 gap-2">
          {workflowSteps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn('w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium', index < 5 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                  {index < 5 ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> : index + 1}
                </div>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-2 whitespace-nowrap">{step}</p>
              </div>
              {index < workflowSteps.length - 1 && <div className={cn('w-6 md:w-12 h-0.5 mx-1 md:mx-2', index < 4 ? 'bg-primary' : 'bg-muted')} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => {
          const type = typeConfig[project.type];
          const status = statusConfig[project.status];
          
          return (
            <div key={project.id} className="glass-card p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                </div>
                <span className={cn(status.class)}>{status.label}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{project.deadline}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{project.assignee}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  ${project.budget.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{project.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              {project.status !== 'completed' && canManage('media') && (
                <button 
                  onClick={() => handleAdvanceStatus(project.id)}
                  className="w-full h-9 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 flex items-center justify-center gap-2 transition-colors"
                >
                  Advance to Next Stage
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <AddProjectDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} />
    </DashboardLayout>
  );
}
