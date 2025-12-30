import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStore } from '@/stores/appStore';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User
} from 'lucide-react';
import { AddTaskDialog } from '@/components/dialogs/AddTaskDialog';
import { format, isToday, isSameDay, parseISO } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

export function TeamCalendar() {
  const { t, language } = useLanguage();
  const { tasks, employees, updateTask } = useAppStore();
  const { canManage } = usePermissions();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const dateLocale = language === 'fr' ? fr : enUS;

  const tasksForSelectedDate = tasks.filter(task => {
    const taskDate = parseISO(task.dueDate);
    return isSameDay(taskDate, selectedDate);
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-destructive/20 text-destructive border-0">{t('hr.high')}</Badge>;
      case 'medium':
        return <Badge className="bg-warning/20 text-warning border-0">{t('hr.medium')}</Badge>;
      case 'low':
        return <Badge className="bg-success/20 text-success border-0">{t('hr.low')}</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (taskId: string, currentStatus: string) => {
    const statusOrder = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % 3] as 'pending' | 'in_progress' | 'completed';
    updateTask(taskId, { status: nextStatus });
  };

  // Get dates that have tasks for the calendar modifier
  const datesWithTasks = tasks.map(task => parseISO(task.dueDate));

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingTasks}</p>
              <p className="text-xs text-muted-foreground">{t('hr.tasksPending')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{inProgressTasks}</p>
              <p className="text-xs text-muted-foreground">{t('hr.tasksInProgress')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedTasks}</p>
              <p className="text-xs text-muted-foreground">{t('hr.tasksCompleted')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {t('hr.teamCalendar')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={dateLocale}
              className="rounded-md"
              modifiers={{
                hasTasks: datesWithTasks,
              }}
              modifiersStyles={{
                hasTasks: {
                  backgroundColor: 'hsl(var(--primary) / 0.2)',
                  fontWeight: 'bold',
                },
              }}
            />
            {canManage('hr') && (
              <Button 
                className="w-full mt-4 gap-2" 
                onClick={() => setAddTaskOpen(true)}
              >
                <Plus className="w-4 h-4" />
                {t('hr.assignTask')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Tasks for selected date */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{t('hr.weeklyTasks')}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('common.noData')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <div 
                    key={task.id}
                    className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => handleStatusChange(task.id, task.status)}
                            className="hover:opacity-70 transition-opacity"
                            title="Changer le statut"
                          >
                            {getStatusIcon(task.status)}
                          </button>
                          <h4 className={`font-medium text-foreground ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                            {task.title}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {task.assigneeName}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getPriorityBadge(task.priority)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddTaskDialog 
        open={addTaskOpen} 
        onOpenChange={setAddTaskOpen}
        defaultDate={selectedDate}
      />
    </div>
  );
}
