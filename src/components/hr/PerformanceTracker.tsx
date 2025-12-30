import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStore } from '@/stores/appStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Target, Users } from 'lucide-react';

export function PerformanceTracker() {
  const { t } = useLanguage();
  const { employees, tasks } = useAppStore();

  const activeEmployees = employees.filter(e => e.status === 'active');

  // Calculate task completion rate per employee
  const employeeStats = activeEmployees.map(employee => {
    const employeeTasks = tasks.filter(t => t.assigneeId === employee.id);
    const completedTasks = employeeTasks.filter(t => t.status === 'completed').length;
    const totalTasks = employeeTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      ...employee,
      totalTasks,
      completedTasks,
      completionRate,
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return <Badge className="bg-success/20 text-success border-0">{t('hr.excellent')}</Badge>;
      case 'good':
        return <Badge className="bg-primary/20 text-primary border-0">{t('hr.good')}</Badge>;
      case 'average':
        return <Badge className="bg-warning/20 text-warning border-0">{t('hr.average')}</Badge>;
      case 'needs_improvement':
        return <Badge className="bg-destructive/20 text-destructive border-0">{t('hr.needsImprovement')}</Badge>;
      default:
        return null;
    }
  };

  const totalCompleted = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const overallRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{overallRate}%</p>
              <p className="text-xs text-muted-foreground">{t('hr.performance')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
              <p className="text-xs text-muted-foreground">{t('hr.tasksCompleted')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {employees.filter(e => e.performance === 'excellent').length}
              </p>
              <p className="text-xs text-muted-foreground">{t('hr.excellent')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Users className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeEmployees.length}</p>
              <p className="text-xs text-muted-foreground">{t('common.active')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {t('hr.performanceTracking')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeeStats.map((employee, index) => (
              <div 
                key={employee.id}
                className="p-4 bg-muted/30 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPerformanceBadge(employee.performance)}
                    <span className="text-lg font-bold text-foreground">
                      {employee.completionRate}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{employee.completedTasks} / {employee.totalTasks} {t('hr.tasksCompleted').toLowerCase()}</span>
                    <span>{employee.department}</span>
                  </div>
                  <Progress value={employee.completionRate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
