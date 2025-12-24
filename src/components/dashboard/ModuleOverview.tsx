import { Building2, Users, Video, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Module {
  name: string;
  description: string;
  icon: React.ElementType;
  stats: { label: string; value: string }[];
  href: string;
  color: string;
}

const modules: Module[] = [
  {
    name: 'Spaces',
    description: 'Coworking & room rentals',
    icon: Building2,
    stats: [
      { label: 'Occupancy', value: '78%' },
      { label: 'Bookings', value: '24' },
    ],
    href: '/spaces',
    color: 'from-primary/20 to-primary/5',
  },
  {
    name: 'CRM',
    description: 'Clients & partnerships',
    icon: Users,
    stats: [
      { label: 'Active Clients', value: '156' },
      { label: 'New This Month', value: '12' },
    ],
    href: '/crm',
    color: 'from-accent/20 to-accent/5',
  },
  {
    name: 'Media',
    description: 'Audio, video & podcasts',
    icon: Video,
    stats: [
      { label: 'Active Projects', value: '8' },
      { label: 'Completed', value: '45' },
    ],
    href: '/media',
    color: 'from-success/20 to-success/5',
  },
  {
    name: 'Students',
    description: 'Education programs',
    icon: GraduationCap,
    stats: [
      { label: 'Enrolled', value: '89' },
      { label: 'Graduated', value: '234' },
    ],
    href: '/students',
    color: 'from-warning/20 to-warning/5',
  },
];

export function ModuleOverview() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Module Overview</h3>
          <p className="text-sm text-muted-foreground">Quick access to key modules</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {modules.map((module) => (
          <Link
            key={module.name}
            to={module.href}
            className="group relative p-5 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/50 transition-all duration-300 hover:border-primary/30"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${module.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <module.icon className="w-8 h-8 text-primary" />
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              
              <h4 className="font-semibold text-foreground mb-1">{module.name}</h4>
              <p className="text-xs text-muted-foreground mb-4">{module.description}</p>
              
              <div className="flex gap-4">
                {module.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
