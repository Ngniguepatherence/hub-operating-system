import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function StatCard({ title, value, change, icon: Icon, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'from-muted/50 to-muted/30',
    primary: 'from-primary/20 to-primary/5',
    success: 'from-success/20 to-success/5',
    warning: 'from-warning/20 to-warning/5',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
  };

  return (
    <div className="stat-card group">
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50 rounded-xl transition-opacity group-hover:opacity-70',
        variantStyles[variant]
      )} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center bg-background/50',
            iconStyles[variant]
          )}>
            <Icon className="w-6 h-6" />
          </div>
          
          {change && (
            <span className={cn(
              'text-sm font-medium px-2.5 py-1 rounded-full',
              change.trend === 'up' 
                ? 'text-success bg-success/10' 
                : 'text-destructive bg-destructive/10'
            )}>
              {change.trend === 'up' ? '+' : '-'}{Math.abs(change.value)}%
            </span>
          )}
        </div>
        
        <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
