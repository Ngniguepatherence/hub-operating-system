import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  GraduationCap, 
  Users, 
  Award, 
  Plus, 
  Search, 
  BookOpen, 
  TrendingUp,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { usePermissions } from '@/hooks/usePermissions';
import { useLanguage } from '@/contexts/LanguageContext';
import { AddStudentDialog } from '@/components/dialogs/AddStudentDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { toast } from 'sonner';

// WDH Training Programs based on business context
const programs = [
  { name: 'Digital Marketing', color: 'from-primary to-primary/50', description: 'Social media, SEO, content strategy' },
  { name: 'Video Production', color: 'from-accent to-accent/50', description: 'Filming, editing, corporate videos' },
  { name: 'Audio Engineering', color: 'from-success to-success/50', description: 'Recording, mixing, podcasts' },
  { name: 'UI/UX Design', color: 'from-warning to-warning/50', description: 'User experience, interfaces' },
  { name: 'Content Creation', color: 'from-info to-info/50', description: 'Writing, storytelling, branding' },
  { name: 'Startup Mentorship', color: 'from-destructive to-destructive/50', description: 'Business development, pitching' },
];

export default function Students() {
  const { t } = useLanguage();
  const { canManage } = usePermissions();
  const { students, updateStudent, deleteStudent } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const canManageStudents = canManage('students');

  // Calculate program enrollment
  const programsWithEnrollment = useMemo(() => {
    return programs.map(p => ({
      ...p,
      enrolled: students.filter(s => s.program === p.name && s.status !== 'completed').length
    }));
  }, [students]);

  // Calculate stats
  const stats = useMemo(() => {
    const active = students.filter(s => s.status === 'active').length;
    const completed = students.filter(s => s.status === 'completed').length;
    const pending = students.filter(s => s.status === 'pending').length;
    const avgProgress = students.length > 0 
      ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
      : 0;
    
    return { active, completed, pending, total: students.length, avgProgress };
  }, [students]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.university.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProgram = filterProgram === 'all' || s.program === filterProgram;
      const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
      return matchesSearch && matchesProgram && matchesStatus;
    });
  }, [students, searchTerm, filterProgram, filterStatus]);

  const handleGraduate = (id: string) => {
    updateStudent(id, { progress: 100, status: 'completed' });
    toast.success(t('students.studentGraduated'));
  };

  const handleActivate = (id: string) => {
    updateStudent(id, { status: 'active' });
    toast.success(t('students.studentActivated'));
  };

  const handleDeleteClick = (id: string) => {
    setSelectedStudent(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent);
      toast.success(t('students.studentRemoved'));
      setSelectedStudent(null);
    }
  };

  return (
    <DashboardLayout title={t('students.title')} subtitle={t('students.subtitle')}>
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('students.searchStudents')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground"
          >
            <option value="all">{t('students.allPrograms')}</option>
            {programs.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground"
          >
            <option value="all">{t('students.allStatus')}</option>
            <option value="active">{t('common.active')}</option>
            <option value="pending">{t('common.pending')}</option>
            <option value="completed">{t('common.completed')}</option>
          </select>
        </div>
        {canManageStudents && (
          <button 
            onClick={() => setAddDialogOpen(true)}
            className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            {t('students.enrollStudent')}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t('students.activeStudents')}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.active}</p>
          <p className="text-xs text-success mt-1">+{stats.pending} {t('common.pending').toLowerCase()}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-success" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t('students.graduated')}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.completed}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('students.alumniNetwork')}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-warning" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t('students.activePrograms')}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{programs.length}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t('students.avgProgress')}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.avgProgress}%</p>
          <p className="text-xs text-success mt-1">{t('students.programCompletion')}</p>
        </div>
      </div>

      {/* Programs Overview */}
      <div className="glass-card p-4 md:p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">{t('students.trainingPrograms')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {programsWithEnrollment.map((program) => (
            <div 
              key={program.name} 
              className="text-center p-3 md:p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setFilterProgram(filterProgram === program.name ? 'all' : program.name)}
            >
              <div className={cn(
                'w-10 h-10 md:w-12 md:h-12 rounded-full mx-auto mb-2 md:mb-3 bg-gradient-to-br flex items-center justify-center',
                program.color
              )}>
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </div>
              <p className="text-xs md:text-sm font-medium text-foreground line-clamp-2">{program.name}</p>
              <p className="text-xl md:text-2xl font-bold text-foreground mt-1">{program.enrolled}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">{t('students.students')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Students Table - Desktop */}
      <div className="glass-card overflow-hidden hidden lg:block">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{t('students.activeStudents')} ({filteredStudents.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.name')}</th>
                <th>{t('students.program')}</th>
                <th>{t('students.university')}</th>
                <th>{t('students.duration')}</th>
                <th>{t('media.progress')}</th>
                <th>{t('students.mentor')}</th>
                <th>{t('common.status')}</th>
                {canManageStudents && <th className="text-center">{t('common.actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={canManageStudents ? 8 : 7} className="text-center text-muted-foreground py-8">
                    {t('students.noStudentsFound')}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{student.name}</span>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{student.program}</td>
                    <td className="text-muted-foreground text-sm">{student.university}</td>
                    <td className="text-muted-foreground text-sm">
                      {student.startDate} - {student.endDate}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              student.progress >= 100 
                                ? "bg-success" 
                                : "bg-gradient-to-r from-primary to-accent"
                            )}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{student.mentor || t('students.unassigned')}</td>
                    <td>
                      <span className={cn(
                        student.status === 'active' && 'badge-success',
                        student.status === 'completed' && 'badge-info',
                        student.status === 'pending' && 'badge-warning'
                      )}>
                        {student.status === 'active' ? t('common.active') : 
                         student.status === 'completed' ? t('common.completed') : 
                         t('common.pending')}
                      </span>
                    </td>
                    {canManageStudents && (
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <a
                            href={`mailto:${student.email}`}
                            className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          {student.phone && (
                            <a
                              href={`tel:${student.phone}`}
                              className="p-2 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success transition-colors"
                              title={t('common.phone')}
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          {student.status === 'pending' && (
                            <button
                              onClick={() => handleActivate(student.id)}
                              className="px-2 py-1 rounded text-xs bg-success/10 text-success hover:bg-success/20"
                            >
                              {t('students.activate')}
                            </button>
                          )}
                          {student.status === 'active' && student.progress < 100 && (
                            <button
                              onClick={() => handleGraduate(student.id)}
                              className="px-2 py-1 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              {t('students.graduate')}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(student.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Students Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        <h3 className="font-semibold text-foreground">{t('students.activeStudents')} ({filteredStudents.length})</h3>
        {filteredStudents.length === 0 ? (
          <div className="glass-card p-6 text-center text-muted-foreground">
            {t('students.noStudentsFound')}
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="glass-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.program}</p>
                  </div>
                </div>
                <span className={cn(
                  student.status === 'active' && 'badge-success',
                  student.status === 'completed' && 'badge-info',
                  student.status === 'pending' && 'badge-warning'
                )}>
                  {student.status === 'active' ? t('common.active') : 
                   student.status === 'completed' ? t('common.completed') : 
                   t('common.pending')}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('students.university')}</span>
                  <span className="text-foreground">{student.university}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('students.mentor')}</span>
                  <span className="text-foreground">{student.mentor || t('students.unassigned')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('media.progress')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          student.progress >= 100 
                            ? "bg-success" 
                            : "bg-gradient-to-r from-primary to-accent"
                        )}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-foreground">{student.progress}%</span>
                  </div>
                </div>
              </div>

              {canManageStudents && (
                <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                  {student.status === 'pending' && (
                    <button
                      onClick={() => handleActivate(student.id)}
                      className="flex-1 py-2 rounded-lg text-sm bg-success/10 text-success hover:bg-success/20"
                    >
                      {t('students.activate')}
                    </button>
                  )}
                  {student.status === 'active' && student.progress < 100 && (
                    <button
                      onClick={() => handleGraduate(student.id)}
                      className="flex-1 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {t('students.graduate')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(student.id)}
                    className="py-2 px-4 rounded-lg text-sm bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AddStudentDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('common.confirm')}
        description={t('crm.deleteConfirm')}
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </DashboardLayout>
  );
}
