import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Building } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  type: 'enterprise' | 'startup' | 'individual';
  status: 'active' | 'prospect' | 'inactive';
  revenue: number;
  lastContact: string;
}

const clients: Client[] = [
  {
    id: '1',
    name: 'Jean-Pierre Kamdem',
    company: 'MTN Cameroon',
    email: 'jp.kamdem@mtn.cm',
    phone: '+237 699 123 456',
    type: 'enterprise',
    status: 'active',
    revenue: 45000,
    lastContact: '2 days ago',
  },
  {
    id: '2',
    name: 'Marie Nguefack',
    company: 'Startup Hub Africa',
    email: 'marie@startuphub.africa',
    phone: '+237 677 234 567',
    type: 'startup',
    status: 'active',
    revenue: 12000,
    lastContact: '1 week ago',
  },
  {
    id: '3',
    name: 'Paul Mbarga',
    company: 'Cameroon Tech Corp',
    email: 'paul.m@camtech.cm',
    phone: '+237 655 345 678',
    type: 'enterprise',
    status: 'prospect',
    revenue: 0,
    lastContact: '3 days ago',
  },
  {
    id: '4',
    name: 'Aisha Bello',
    company: 'Digital Creators CM',
    email: 'aisha@digitalcreators.cm',
    phone: '+237 698 456 789',
    type: 'startup',
    status: 'active',
    revenue: 8500,
    lastContact: 'Today',
  },
  {
    id: '5',
    name: 'Emmanuel Fotso',
    company: 'Independent',
    email: 'e.fotso@gmail.com',
    phone: '+237 676 567 890',
    type: 'individual',
    status: 'inactive',
    revenue: 2000,
    lastContact: '1 month ago',
  },
];

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
  return (
    <DashboardLayout title="CRM" subtitle="Manage clients and partnerships">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        <button className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Clients', value: '156', change: '+12 this month' },
          { label: 'Active Clients', value: '124', change: '79% of total' },
          { label: 'Total Revenue', value: '$284K', change: '+18% YoY' },
          { label: 'Avg. Deal Size', value: '$4,250', change: '+5% vs last Q' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            <p className="text-xs text-primary mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Clients Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Type</th>
                <th>Status</th>
                <th>Revenue</th>
                <th>Last Contact</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{client.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="w-3 h-3" />
                          {client.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={typeStyles[client.type]}>
                      {client.type}
                    </span>
                  </td>
                  <td>
                    <span className={statusStyles[client.status]}>
                      {client.status}
                    </span>
                  </td>
                  <td className="font-medium text-foreground">
                    ${client.revenue.toLocaleString()}
                  </td>
                  <td className="text-muted-foreground">{client.lastContact}</td>
                  <td>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted/50">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted/50">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
