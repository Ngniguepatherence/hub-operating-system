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
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';

interface AddBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBookingDialog({ open, onOpenChange }: AddBookingDialogProps) {
  const { spaces, clients, addBooking } = useAppStore();
  const [formData, setFormData] = React.useState({
    spaceId: '',
    clientId: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const availableSpaces = spaces.filter((s) => s.status === 'available');
  const selectedSpace = spaces.find((s) => s.id === formData.spaceId);
  const selectedClient = clients.find((c) => c.id === formData.clientId);

  const calculatePrice = () => {
    if (!selectedSpace || !formData.startTime || !formData.endTime) return 0;
    const start = parseInt(formData.startTime.split(':')[0]);
    const end = parseInt(formData.endTime.split(':')[0]);
    const hours = end - start;
    return hours > 0 ? hours * selectedSpace.pricePerHour : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.spaceId || !formData.clientId || !formData.date || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!selectedSpace || !selectedClient) return;

    addBooking({
      spaceId: formData.spaceId,
      spaceName: selectedSpace.name,
      clientId: formData.clientId,
      clientName: selectedClient.name,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: 'confirmed',
      totalPrice: calculatePrice(),
    });
    
    toast.success('Booking created successfully');
    onOpenChange(false);
    setFormData({
      spaceId: '',
      clientId: '',
      date: '',
      startTime: '',
      endTime: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-foreground">New Booking</DialogTitle>
            <DialogDescription>
              Reserve a space for a client.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Select Space *</Label>
              <Select
                value={formData.spaceId}
                onValueChange={(value) => setFormData({ ...formData, spaceId: value })}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Choose a space" />
                </SelectTrigger>
                <SelectContent>
                  {availableSpaces.map((space) => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name} - ${space.pricePerHour}/hr
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableSpaces.length === 0 && (
                <p className="text-sm text-warning">No spaces available at the moment</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Select Client *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="bg-muted/50"
                />
              </div>
            </div>
            {calculatePrice() > 0 && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-muted-foreground">Estimated Total</p>
                <p className="text-2xl font-bold text-primary">${calculatePrice()}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              Create Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
