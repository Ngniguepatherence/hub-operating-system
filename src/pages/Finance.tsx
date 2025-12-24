import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Download,
  Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const cashflowData = [
  { month: 'Jan', income: 28000, expenses: 19000 },
  { month: 'Feb', income: 32000, expenses: 22000 },
  { month: 'Mar', income: 35000, expenses: 21000 },
  { month: 'Apr', income: 29000, expenses: 23000 },
  { month: 'May', income: 41000, expenses: 25000 },
  { month: 'Jun', income: 38000, expenses: 24000 },
];

const revenueByService = [
  { name: 'Media Production', value: 42, color: 'hsl(187, 92%, 50%)' },
  { name: 'Space Rentals', value: 28, color: 'hsl(239, 84%, 67%)' },
  { name: 'Student Programs', value: 18, color: 'hsl(142, 76%, 45%)' },
  { name: 'Other Services', value: 12, color: 'hsl(38, 92%, 50%)' },
];

interface Transaction {
  id: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'approved';
}

const transactions: Transaction[] = [
  { id: '1', description: 'MTN Corporate Video - Final Payment', type: 'income', category: 'Media', amount: 7500, date: 'Dec 23, 2024', status: 'completed' },
  { id: '2', description: 'Equipment Purchase - Camera Lens', type: 'expense', category: 'Equipment', amount: 2800, date: 'Dec 22, 2024', status: 'approved' },
  { id: '3', description: 'Conference Room Rental - Startup Hub', type: 'income', category: 'Spaces', amount: 450, date: 'Dec 22, 2024', status: 'completed' },
  { id: '4', description: 'Software Subscriptions - Adobe Suite', type: 'expense', category: 'Software', amount: 599, date: 'Dec 21, 2024', status: 'pending' },
  { id: '5', description: 'Podcast Production - Episode 45', type: 'income', category: 'Media', amount: 800, date: 'Dec 21, 2024', status: 'completed' },
];

export default function Finance() {
  return (
    <DashboardLayout title="Finance & Invoicing" subtitle="Revenue, expenses and cash flow management">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-3">
          <button className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 bg-success/10 text-success border border-success/30 font-medium rounded-lg flex items-center gap-2 hover:bg-success/20 transition-colors">
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
          <button className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Record Expense
          </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="flex items-center gap-1 text-sm text-success">
              <ArrowUpRight className="w-4 h-4" />
              +18.2%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground mt-1">$203,450</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <span className="flex items-center gap-1 text-sm text-destructive">
              <ArrowDownRight className="w-4 h-4" />
              +5.1%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-foreground mt-1">$134,200</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <span className="flex items-center gap-1 text-sm text-success">
              <ArrowUpRight className="w-4 h-4" />
              +22.4%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Net Profit</p>
          <p className="text-2xl font-bold text-foreground mt-1">$69,250</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Pending Invoices</p>
          <p className="text-2xl font-bold text-foreground mt-1">$12,800</p>
          <p className="text-xs text-warning mt-1">4 invoices awaiting payment</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Cash Flow</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 10%)',
                    border: '1px solid hsl(217, 33%, 18%)',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="income" stroke="hsl(142, 76%, 45%)" fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenses" stroke="hsl(0, 84%, 60%)" fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Service */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Revenue by Service</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByService}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueByService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {revenueByService.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="font-medium text-foreground">{tx.description}</td>
                  <td className="text-muted-foreground">{tx.category}</td>
                  <td className="text-muted-foreground">{tx.date}</td>
                  <td>
                    <span className={cn(
                      tx.status === 'completed' && 'badge-success',
                      tx.status === 'pending' && 'badge-warning',
                      tx.status === 'approved' && 'badge-info'
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={cn(
                    'text-right font-medium',
                    tx.type === 'income' ? 'text-success' : 'text-destructive'
                  )}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
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
