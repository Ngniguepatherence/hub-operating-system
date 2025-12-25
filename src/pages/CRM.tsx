import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Building, Trash2, Edit } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { usePermissions } from '@/hooks/usePermissions';
import { AddClientDialog } from '@/components/dialogs/AddClientDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { toast } from 'sonner';

const typeStyles = {
  enterprise: 'badge-info',
  startup: 'badge-success',
  individual: 'badge-muted',
};

const statusStyles = {
  active: 'badge-success',
  prospect: 'badge-warning',
  inactive: 'badge-muted',
};

export default function CRM() {
  const { clients, deleteClient } = useAppStore();
  const { canManage } = usePermissions();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setSelectedClientId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedClientId) {
      deleteClient(selectedClientId);
      toast.success('Client deleted successfully');
    }
    setDeleteDialogOpen(false);
    setSelectedClientId(null);
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
    toast.info('Opening email client...');
  };

  const handlePhone = (phone: string) => {
    window.location.href = `tel:${phone}`;
    toast.info('Initiating call...');
  };

  return (
    <DashboardLayout title="CRM" subtitle="Manage clients and partnerships">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        {canManage('clients') && (
          <button 
            onClick={() => setAddDialogOpen(true)}
            className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Clients', value: clients.length.toString(), change: `${clients.filter(c => c.status === 'active').length} active` },
          { label: 'Active Clients', value: clients.filter(c => c.status === 'active').length.toString(), change: `${Math.round((clients.filter(c => c.status === 'active').length / clients.length) * 100)}% of total` },
          { label: 'Total Revenue', value: `$${clients.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}`, change: 'From all clients' },
          { label: 'Prospects', value: clients.filter(c => c.status === 'prospect').length.toString(), change: 'Pending conversion' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            <p className="text-xs text-primary mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="glass-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                </div>
              </div>
              {canManage('clients') && (
                <button 
                  onClick={() => handleDelete(client.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={typeStyles[client.type]}>{client.type}</span>
              <span className={statusStyles[client.status]}>{client.status}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-muted-foreground">{client.lastContact}</span>
              <span className="font-medium text-foreground">${client.revenue.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-2 pt-3 border-t border-border/50">
              <button 
                onClick={() => handleEmail(client.email)}
                className="flex-1 h-9 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button 
                onClick={() => handlePhone(client.phone)}
                className="flex-1 h-9 bg-muted/50 text-foreground font-medium rounded-lg hover:bg-muted flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddClientDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
}
