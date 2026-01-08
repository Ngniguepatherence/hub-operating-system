import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useAppStore } from '@/stores/appStore';
import { AddEmployeeDialog } from '@/components/dialogs/AddEmployeeDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { TeamCalendar } from '@/components/hr/TeamCalendar';
import { PerformanceTracker } from '@/components/hr/PerformanceTracker';
import { PayrollCalculator } from '@/components/hr/PayrollCalculator';
import { TaxManagement } from '@/components/hr/TaxManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Users, 
  Building2, 
  Calendar,
  Mail,
  Phone,
  MoreHorizontal,
  UserCheck,
  UserX,
  Trash2,
  TrendingUp,
  Calculator,
  Receipt
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function HR() {
  const { t } = useLanguage();
  const { canManage } = usePermissions();
  const { employees, departments, deleteEmployee, updateEmployee } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const canManageHR = canManage('hr');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = [
    { title: t('hr.employees'), value: employees.length.toString(), icon: Users, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: t('hr.departments'), value: departments.length.toString(), icon: Building2, color: 'text-accent', bgColor: 'bg-accent/10' },
    { title: t('common.active'), value: employees.filter(e => e.status === 'active').length.toString(), icon: UserCheck, color: 'text-success', bgColor: 'bg-success/10' },
    { title: t('hr.onLeave'), value: employees.filter(e => e.status === 'on_leave').length.toString(), icon: Calendar, color: 'text-warning', bgColor: 'bg-warning/10' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-success/20 text-success border-0">{t('common.active')}</Badge>;
      case 'on_leave': return <Badge className="bg-warning/20 text-warning border-0">{t('hr.onLeave')}</Badge>;
      case 'inactive': return <Badge className="bg-muted text-muted-foreground border-0">{t('common.inactive')}</Badge>;
      default: return null;
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent': return <Badge className="bg-success/20 text-success border-0">{t('hr.excellent')}</Badge>;
      case 'good': return <Badge className="bg-primary/20 text-primary border-0">{t('hr.good')}</Badge>;
      case 'average': return <Badge className="bg-warning/20 text-warning border-0">{t('hr.average')}</Badge>;
      case 'needs_improvement': return <Badge className="bg-destructive/20 text-destructive border-0">{t('hr.needsImprovement')}</Badge>;
      default: return null;
    }
  };

  const handleDelete = (id: string) => { setSelectedEmployee(id); setDeleteDialogOpen(true); };
  const confirmDelete = () => { if (selectedEmployee) { deleteEmployee(selectedEmployee); setDeleteDialogOpen(false); setSelectedEmployee(null); } };
  const toggleStatus = (id: string, currentStatus: string) => { updateEmployee(id, { status: currentStatus === 'active' ? 'inactive' : 'active' as any }); };

  return (
    <DashboardLayout title={t('hr.title')} subtitle={t('hr.subtitle')}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
                <div><p className="text-2xl font-bold text-foreground">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.title}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="team" className="gap-2"><Users className="w-4 h-4" /><span className="hidden sm:inline">{t('hr.employees')}</span></TabsTrigger>
          <TabsTrigger value="payroll" className="gap-2"><Calculator className="w-4 h-4" /><span className="hidden sm:inline">{t('hr.payroll')}</span></TabsTrigger>
          <TabsTrigger value="tax" className="gap-2"><Receipt className="w-4 h-4" /><span className="hidden sm:inline">{t('hr.fiscal')}</span></TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2"><Calendar className="w-4 h-4" /><span className="hidden sm:inline">{t('hr.calendar')}</span></TabsTrigger>
          <TabsTrigger value="performance" className="gap-2"><TrendingUp className="w-4 h-4" /><span className="hidden sm:inline">{t('hr.performance')}</span></TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={t('common.search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-muted/50" />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48 bg-muted/50"><SelectValue placeholder={t('hr.department')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')} {t('hr.departments')}</SelectItem>
                {departments.map((dept) => (<SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-muted/50"><SelectValue placeholder={t('common.status')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="active">{t('common.active')}</SelectItem>
                <SelectItem value="on_leave">{t('hr.onLeave')}</SelectItem>
                <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
              </SelectContent>
            </Select>
            {canManageHR && (<Button onClick={() => setAddDialogOpen(true)} className="gap-2"><Plus className="w-4 h-4" />{t('hr.addEmployee')}</Button>)}
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="glass-card hover:border-primary/30 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">{employee.name.charAt(0)}</span>
                      </div>
                      <div><h3 className="font-semibold text-foreground">{employee.name}</h3><p className="text-sm text-muted-foreground">{employee.position}</p></div>
                    </div>
                    {canManageHR && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStatus(employee.id, employee.status)}>
                            {employee.status === 'active' ? <><UserX className="w-4 h-4 mr-2" /> {t('common.inactive')}</> : <><UserCheck className="w-4 h-4 mr-2" /> {t('common.active')}</>}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(employee.id)}><Trash2 className="w-4 h-4 mr-2" /> {t('common.delete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="w-4 h-4" />{employee.department}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-4 h-4" />{employee.email}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="w-4 h-4" />{employee.phone}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4" />{employee.joinDate}</div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">{getStatusBadge(employee.status)}{getPerformanceBadge(employee.performance)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredEmployees.length === 0 && (<div className="text-center py-12"><Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">{t('common.noData')}</p></div>)}
        </TabsContent>

        <TabsContent value="payroll"><PayrollCalculator /></TabsContent>
        <TabsContent value="tax"><TaxManagement /></TabsContent>
        <TabsContent value="calendar"><TeamCalendar /></TabsContent>
        <TabsContent value="performance"><PerformanceTracker /></TabsContent>
      </Tabs>

      <AddEmployeeDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <ConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title={t('common.confirm')} description={t('crm.deleteConfirm')} onConfirm={confirmDelete} />
    </DashboardLayout>
  );
}
