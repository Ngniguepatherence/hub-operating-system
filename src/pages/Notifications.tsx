import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const { t } = useLanguage();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Info className="w-5 h-5 text-info" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return t('common.loading').replace('...', '');
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout title={t('notifications.title')} subtitle={t('notifications.subtitle')}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 
                ? `${unreadCount} ${unreadCount > 1 ? 'non lues' : 'non lue'}`
                : t('notifications.noNotifications')
              }
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllNotificationsRead}
            className="gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={cn(
              "glass-card transition-all cursor-pointer hover:border-primary/30",
              !notification.read && "border-primary/50 bg-primary/5"
            )}
            onClick={() => !notification.read && markNotificationRead(notification.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  notification.type === 'success' && "bg-success/10",
                  notification.type === 'warning' && "bg-warning/10",
                  notification.type === 'error' && "bg-destructive/10",
                  notification.type === 'info' && "bg-info/10",
                )}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={cn(
                        "font-medium",
                        !notification.read ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('notifications.noNotifications')}</p>
        </div>
      )}
    </DashboardLayout>
  );
}
