import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}

export function AddTaskDialog({ open, onOpenChange, defaultDate }: AddTaskDialogProps) {
  const { t } = useLanguage();
  const { employees, addTask } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  useEffect(() => {
    if (defaultDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: format(defaultDate, 'yyyy-MM-dd'),
      }));
    }
  }, [defaultDate, open]);

  const activeEmployees = employees.filter(e => e.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.assigneeId || !formData.dueDate) {
      toast.error(t('common.fillRequired'));
      return;
    }

    const assignee = employees.find(e => e.id === formData.assigneeId);
    
    addTask({
      title: formData.title,
      description: formData.description,
      assigneeId: formData.assigneeId,
      assigneeName: assignee?.name || '',
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: 'pending',
    });

    toast.success(t('hr.taskAssigned'));
    
    setFormData({
      title: '',
      description: '',
      assigneeId: '',
      dueDate: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
      priority: 'medium',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {t('hr.assignTask')}
          </DialogTitle>
          <DialogDescription>
            {t('hr.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('hr.taskTitle')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('hr.taskTitle')}
                className="bg-muted/50"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">{t('hr.taskDescription')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('hr.taskDescription')}
                className="bg-muted/50 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assignee">{t('media.assignee')} *</Label>
                <Select
                  value={formData.assigneeId}
                  onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder={t('media.assignTo')} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">{t('hr.priority')} *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder={t('hr.priority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">{t('hr.high')}</SelectItem>
                    <SelectItem value="medium">{t('hr.medium')}</SelectItem>
                    <SelectItem value="low">{t('hr.low')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">{t('hr.dueDate')} *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="bg-muted/50"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="gap-2">
              <Plus className="w-4 h-4" />
              {t('hr.assignTask')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
