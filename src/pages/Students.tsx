import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GraduationCap, Users, Award, Calendar, Plus, Search, BookOpen, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  program: string;
  university: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  mentor: string;
}

const students: Student[] = [
  { id: '1', name: 'Aline Kamga', program: 'Digital Marketing', university: 'University of Douala', startDate: 'Sep 2024', endDate: 'Mar 2025', status: 'active', progress: 65, mentor: 'Sarah Mbeki' },
  { id: '2', name: 'Paul Nkeng', program: 'Video Production', university: 'University of Yaoundé I', startDate: 'Oct 2024', endDate: 'Apr 2025', status: 'active', progress: 45, mentor: 'Jean Fotso' },
  { id: '3', name: 'Marie Essomba', program: 'UI/UX Design', university: 'ESSTIC', startDate: 'Nov 2024', endDate: 'May 2025', status: 'active', progress: 25, mentor: 'Eric Mboua' },
  { id: '4', name: 'David Tchoumi', program: 'Audio Engineering', university: 'IST Douala', startDate: 'Aug 2024', endDate: 'Feb 2025', status: 'active', progress: 80, mentor: 'Michel Awono' },
  { id: '5', name: 'Grace Njoya', program: 'Content Creation', university: 'University of Buea', startDate: 'Jun 2024', endDate: 'Dec 2024', status: 'completed', progress: 100, mentor: 'Sarah Mbeki' },
];

const programs = [
  { name: 'Digital Marketing', enrolled: 24, color: 'from-primary to-primary/50' },
  { name: 'Video Production', enrolled: 18, color: 'from-accent to-accent/50' },
  { name: 'Audio Engineering', enrolled: 15, color: 'from-success to-success/50' },
  { name: 'UI/UX Design', enrolled: 22, color: 'from-warning to-warning/50' },
  { name: 'Content Creation', enrolled: 10, color: 'from-info to-info/50' },
];

export default function Students() {
  return (
    <DashboardLayout title="Student Programs" subtitle="One foot in school, one foot in the professional world">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Enroll Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Total Enrolled</p>
          <p className="text-2xl font-bold text-foreground mt-1">89</p>
          <p className="text-xs text-success mt-1">+12 this semester</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-success" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Graduated</p>
          <p className="text-2xl font-bold text-foreground mt-1">234</p>
          <p className="text-xs text-muted-foreground mt-1">Since 2020</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-warning" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Active Programs</p>
          <p className="text-2xl font-bold text-foreground mt-1">5</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Placement Rate</p>
          <p className="text-2xl font-bold text-foreground mt-1">87%</p>
          <p className="text-xs text-success mt-1">+5% vs last year</p>
        </div>
      </div>

      {/* Programs Overview */}
      <div className="glass-card p-4 md:p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Programs Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {programs.map((program) => (
            <div key={program.name} className="text-center p-3 md:p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className={cn(
                'w-10 h-10 md:w-12 md:h-12 rounded-full mx-auto mb-2 md:mb-3 bg-gradient-to-br flex items-center justify-center',
                program.color
              )}>
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </div>
              <p className="text-xs md:text-sm font-medium text-foreground line-clamp-2">{program.name}</p>
              <p className="text-xl md:text-2xl font-bold text-foreground mt-1">{program.enrolled}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">students</p>
            </div>
          ))}
        </div>
      </div>

      {/* Students Table - Desktop */}
      <div className="glass-card overflow-hidden hidden lg:block">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Current Students</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Program</th>
                <th>University</th>
                <th>Duration</th>
                <th>Progress</th>
                <th>Mentor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{student.name}</span>
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
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{student.mentor}</td>
                  <td>
                    <span className={cn(
                      student.status === 'active' && 'badge-success',
                      student.status === 'completed' && 'badge-info',
                      student.status === 'pending' && 'badge-warning'
                    )}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Students Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        <h3 className="font-semibold text-foreground">Current Students</h3>
        {students.map((student) => (
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
                {student.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">University</span>
                <span className="text-foreground">{student.university}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mentor</span>
                <span className="text-foreground">{student.mentor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="text-foreground">{student.startDate} - {student.endDate}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium text-foreground">{student.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
