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

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'income' | 'expense';
}

// WDH-specific categories based on business services
const categories = {
  income: [
    'Media Production',           // Video, audio, podcast
    'Space Rentals',              // Coworking, offices, conference rooms
    'Event Services',             // Event room rentals, conferences
    'Communication & Branding',   // Corporate branding, design
    'Student Programs',           // Training program fees
    'Startup Support',            // Consulting, incubation fees
    'Equipment Rental',           // Studio equipment rental
    'Other Income'
  ],
  expense: [
    'Equipment & Hardware',       // Cameras, microphones, computers
    'Software & Subscriptions',   // Adobe, editing software
    'Salaries & Contractors',     // Staff, freelancers
    'Utilities & Rent',           // Electricity, internet, building rent
    'Marketing & Advertising',    // Promotion, social media ads
    'Office Supplies',            // General supplies
    'Maintenance & Repairs',      // Equipment and space maintenance
    'Training & Development',     // Staff training
    'Other Expense'
  ],
};

export function AddTransactionDialog({ open, onOpenChange, type }: AddTransactionDialogProps) {
  const addTransaction = useAppStore((state) => state.addTransaction);
  const clients = useAppStore((state) => state.clients);
  const [formData, setFormData] = React.useState({
    description: '',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    clientId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.category || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    addTransaction({
      description: formData.description,
      type,
      category: formData.category,
      amount: formData.amount,
      date: new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: type === 'income' ? 'completed' : 'pending',
    });
    
    toast.success(`${type === 'income' ? 'Income' : 'Expense'} recorded successfully`);
    onOpenChange(false);
    setFormData({
      description: '',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      clientId: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {type === 'income' ? 'New Invoice / Income' : 'Record Expense'}
            </DialogTitle>
            <DialogDescription>
              {type === 'income' 
                ? 'Record income from WDH services: media, spaces, training, etc.' 
                : 'Record a business expense for approval workflow.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {type === 'income' && (
              <div className="space-y-2">
                <Label>Client (Optional)</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={type === 'income' 
                  ? 'Corporate video production for MTN' 
                  : 'Camera lens purchase'
                }
                className="bg-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[type].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (XAF) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  placeholder="500000"
                  className="bg-muted/50"
                />
              </div>
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
            {type === 'expense' && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                <p className="text-sm text-warning">
                  <strong>Workflow:</strong> This expense will be submitted for COO approval. 
                  If amount exceeds threshold, CEO approval will also be required.
                </p>
              </div>
            )}
            {type === 'income' && (
              <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                <p className="text-sm text-success">
                  This income will be recorded immediately and reflected in the revenue dashboard.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={type === 'income' 
                ? 'bg-success text-success-foreground hover:bg-success/90' 
                : 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
              }
            >
              {type === 'income' ? 'Record Income' : 'Submit for Approval'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}