import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore, Student } from '@/stores/appStore';
import { toast } from 'sonner';

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// WDH Training Programs based on business services
const programs = [
  { name: 'Digital Marketing', description: 'Social media, SEO, content strategy, analytics' },
  { name: 'Video Production', description: 'Filming, editing, motion graphics, corporate videos' },
  { name: 'Audio Engineering', description: 'Recording, mixing, mastering, podcast production' },
  { name: 'UI/UX Design', description: 'User experience, interface design, prototyping' },
  { name: 'Content Creation', description: 'Copywriting, storytelling, brand content' },
  { name: 'Startup Mentorship', description: 'Business development, pitching, fundraising' },
  { name: 'Communication & Branding', description: 'Corporate identity, visual communication' },
  { name: 'Web Development', description: 'Frontend, backend, full-stack development' },
];

// WDH Mentors
const mentors = [
  'Sarah Mbeki',
  'Jean Fotso',
  'Eric Mboua',
  'Michel Awono',
  'Patricia Ndam',
  'Robert Tchana',
];

// Partner universities in Cameroon
const universities = [
  'University of Douala',
  'University of Yaoundé I',
  'University of Yaoundé II',
  'University of Buea',
  'University of Dschang',
  'University of Bamenda',
  'ESSTIC',
  'IST Douala',
  'Catholic University of Central Africa',
  'Other',
];

export function AddStudentDialog({ open, onOpenChange }: AddStudentDialogProps) {
  const addStudent = useAppStore((state) => state.addStudent);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    university: '',
    customUniversity: '',
    startDate: '',
    endDate: '',
    mentor: '',
    status: 'pending' as Student['status'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.program || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const university = formData.university === 'Other' ? formData.customUniversity : formData.university;
    if (!university) {
      toast.error('Please specify the university');
      return;
    }

    addStudent({
      ...formData,
      university,
      startDate: new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      endDate: new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
    
    toast.success('Student enrolled successfully! They will start in pending status.');
    onOpenChange(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      program: '',
      university: '',
      customUniversity: '',
      startDate: '',
      endDate: '',
      mentor: '',
      status: 'pending',
    });
  };

  const selectedProgram = programs.find(p => p.name === formData.program);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-foreground">Enroll New Student</DialogTitle>
            <DialogDescription>
              Add a student to the "One foot in school, one foot in the professional world" program.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Personal Information */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Personal Information</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jean-Pierre Kamdem"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jp.kamdem@email.com"
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+237 6XX XXX XXX"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>University *</Label>
                <Select
                  value={formData.university}
                  onValueChange={(value) => setFormData({ ...formData, university: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>
                        {uni}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.university === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="customUniversity">University Name *</Label>
                <Input
                  id="customUniversity"
                  value={formData.customUniversity}
                  onChange={(e) => setFormData({ ...formData, customUniversity: e.target.value })}
                  placeholder="Enter university name"
                  className="bg-muted/50"
                />
              </div>
            )}

            {/* Program Information */}
            <div className="space-y-1 pt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Program Details</p>
            </div>
            <div className="space-y-2">
              <Label>Training Program *</Label>
              <Select
                value={formData.program}
                onValueChange={(value) => setFormData({ ...formData, program: value })}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.name} value={program.name}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProgram && (
                <p className="text-xs text-muted-foreground">{selectedProgram.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Assigned Mentor</Label>
              <Select
                value={formData.mentor}
                onValueChange={(value) => setFormData({ ...formData, mentor: value })}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Assign a mentor (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor} value={mentor}>
                      {mentor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-muted/50"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm text-primary">
                <strong>Program:</strong> "One foot in school, one foot in the professional world" – 
                Students gain real-world experience while completing their education.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              Enroll Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}