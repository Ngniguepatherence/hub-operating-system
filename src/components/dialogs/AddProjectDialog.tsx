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
import { useAppStore, MediaProject } from '@/stores/appStore';
import { toast } from 'sonner';

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProjectDialog({ open, onOpenChange }: AddProjectDialogProps) {
  const { clients, addProject } = useAppStore();
  const [formData, setFormData] = React.useState({
    title: '',
    clientId: '',
    type: 'video' as MediaProject['type'],
    deadline: '',
    budget: 0,
    assignee: '',
  });

  const selectedClient = clients.find((c) => c.id === formData.clientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline || !formData.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    addProject({
      title: formData.title,
      client: selectedClient?.name || 'WDH Internal',
      clientId: formData.clientId,
      type: formData.type,
      status: 'briefing',
      deadline: new Date(formData.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      budget: formData.budget,
      assignee: formData.assignee || 'Pending',
    });
    
    toast.success('Project created successfully');
    onOpenChange(false);
    setFormData({
      title: '',
      clientId: '',
      type: 'video',
      deadline: '',
      budget: 0,
      assignee: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-foreground">New Media Project</DialogTitle>
            <DialogDescription>
              Create a new media production project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Corporate Video 2024"
                className="bg-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: MediaProject['type']) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">🎬 Video</SelectItem>
                    <SelectItem value="audio">🎵 Audio</SelectItem>
                    <SelectItem value="podcast">🎙️ Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Internal Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal Project</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  placeholder="5000"
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select
                value={formData.assignee}
                onValueChange={(value) => setFormData({ ...formData, assignee: value })}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video Team">Video Team</SelectItem>
                  <SelectItem value="Audio Team">Audio Team</SelectItem>
                  <SelectItem value="Podcast Team">Podcast Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
