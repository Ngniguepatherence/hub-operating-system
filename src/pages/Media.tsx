import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Filter, Play, Clock, User, Calendar, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaProject {
  id: string;
  title: string;
  client: string;
  type: 'video' | 'audio' | 'podcast';
  status: 'briefing' | 'quote' | 'production' | 'review' | 'delivery' | 'completed';
  deadline: string;
  budget: number;
  progress: number;
  assignee: string;
}

const projects: MediaProject[] = [
  {
    id: '1',
    title: 'MTN Corporate Video 2024',
    client: 'MTN Cameroon',
    type: 'video',
    status: 'production',
    deadline: 'Dec 30, 2024',
    budget: 15000,
    progress: 45,
    assignee: 'Video Team',
  },
  {
    id: '2',
    title: 'Startup Hub Podcast Ep. 45',
    client: 'Startup Hub Africa',
    type: 'podcast',
    status: 'review',
    deadline: 'Dec 26, 2024',
    budget: 800,
    progress: 80,
    assignee: 'Audio Team',
  },
  {
    id: '3',
    title: 'Product Launch Video',
    client: 'Cameroon Tech Corp',
    type: 'video',
    status: 'briefing',
    deadline: 'Jan 15, 2025',
    budget: 8500,
    progress: 10,
    assignee: 'Pending',
  },
  {
    id: '4',
    title: 'Radio Ad Campaign',
    client: 'Digital Creators CM',
    type: 'audio',
    status: 'delivery',
    deadline: 'Dec 24, 2024',
    budget: 2500,
    progress: 95,
    assignee: 'Audio Team',
  },
  {
    id: '5',
    title: 'Documentary - Tech in Africa',
    client: 'WDH Internal',
    type: 'video',
    status: 'quote',
    deadline: 'Feb 28, 2025',
    budget: 25000,
    progress: 15,
    assignee: 'Video Team',
  },
];

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

const workflowSteps = [
  'Client Request',
  'Quote',
  'Approval',
  'Deposit',
  'Production',
  'Delivery',
  'Invoice',
  'Archive',
];

export default function Media() {
  return (
    <DashboardLayout title="Media Production" subtitle="Audio, video & podcast management">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-3">
          <button className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter by Type
          </button>
        </div>
        <button className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Active Projects</p>
          <p className="text-2xl font-bold text-foreground mt-1">8</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">This Month Revenue</p>
          <p className="text-2xl font-bold text-foreground mt-1">$42,500</p>
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

      {/* Workflow Visualization */}
      <div className="glass-card p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Media Production Workflow</h3>
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {workflowSteps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  index < 5 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {index < 5 ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <p className="text-xs text-muted-foreground mt-2 whitespace-nowrap">{step}</p>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className={cn(
                  'w-12 h-0.5 mx-2',
                  index < 4 ? 'bg-primary' : 'bg-muted'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => {
          const type = typeConfig[project.type];
          const status = statusConfig[project.status];
          
          return (
            <div
              key={project.id}
              className="glass-card p-6 hover:border-primary/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                </div>
                <span className={cn(status.class)}>{status.label}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {project.deadline}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  {project.assignee}
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  ${project.budget.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{project.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <button className="w-full mt-4 h-9 bg-muted/50 text-foreground font-medium rounded-lg hover:bg-muted flex items-center justify-center gap-2 transition-colors">
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
