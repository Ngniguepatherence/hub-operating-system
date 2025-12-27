import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ModuleOverview } from '@/components/dashboard/ModuleOverview';
import { WorkflowStatus } from '@/components/dashboard/WorkflowStatus';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DollarSign, Users, Building2, Video, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const stats = [
    {
      title: t('dashboard.totalRevenue'),
      value: '$84,254',
      change: { value: 12.5, trend: 'up' as const },
      icon: DollarSign,
      variant: 'primary' as const,
    },
    {
      title: t('dashboard.activeClients'),
      value: '156',
      change: { value: 8.2, trend: 'up' as const },
      icon: Users,
      variant: 'success' as const,
    },
    {
      title: t('dashboard.spaceOccupancy'),
      value: '78%',
      change: { value: 5.1, trend: 'up' as const },
      icon: Building2,
      variant: 'default' as const,
    },
    {
      title: t('dashboard.mediaProjects'),
      value: '8',
      change: { value: 2.3, trend: 'down' as const },
      icon: Video,
      variant: 'warning' as const,
    },
  ];

  const roleSubtitles: Record<string, string> = {
    ceo: t('dashboard.roleSubtitles.ceo'),
    coo: t('dashboard.roleSubtitles.coo'),
    cto: t('dashboard.roleSubtitles.cto'),
    media_manager: t('dashboard.roleSubtitles.media_manager'),
    admin: t('dashboard.roleSubtitles.admin'),
  };

  return (
    <DashboardLayout 
      title={t('dashboard.title')} 
      subtitle={user?.role ? roleSubtitles[user.role] : t('dashboard.welcomeTo')}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={stat.title} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModuleOverview />
        <WorkflowStatus />
      </div>
    </DashboardLayout>
  );
}
