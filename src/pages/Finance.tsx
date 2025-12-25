import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Download,
  Filter,
  Check,
  X,
  Trash2,
  Eye,
  FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { AddTransactionDialog } from '@/components/dialogs/AddTransactionDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { toast } from 'sonner';

const cashflowData = [
  { month: 'Jan', income: 28000, expenses: 19000 },
  { month: 'Feb', income: 32000, expenses: 22000 },
  { month: 'Mar', income: 35000, expenses: 21000 },
  { month: 'Apr', income: 29000, expenses: 23000 },
  { month: 'May', income: 41000, expenses: 25000 },
  { month: 'Jun', income: 38000, expenses: 24000 },
];

// WDH Services revenue breakdown
const revenueByService = [
  { name: 'Media Production', value: 35, color: 'hsl(187, 92%, 50%)' },
  { name: 'Space Rentals', value: 25, color: 'hsl(239, 84%, 67%)' },
  { name: 'Student Programs', value: 15, color: 'hsl(142, 76%, 45%)' },
  { name: 'Communication & Branding', value: 12, color: 'hsl(38, 92%, 50%)' },
  { name: 'Startup Support', value: 8, color: 'hsl(280, 70%, 55%)' },
  { name: 'Event Services', value: 5, color: 'hsl(0, 84%, 60%)' },
];

export default function Finance() {
  const { user } = useAuth();
  const { canManage, canApproveExpenses, hasPermission } = usePermissions();
  const { transactions, approveTransaction, deleteTransaction } = useAppStore();
  
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');

  // Calculate financial stats from transactions
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.status !== 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    
    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      pendingExpenses,
      pendingCount
    };
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      return true;
    });
  }, [transactions, filterType, filterStatus]);

  const handleApprove = (id: string) => {
    if (!canApproveExpenses()) {
      toast.error("You don't have permission to approve expenses");
      return;
    }
    const roleName = user?.role === 'ceo' ? 'CEO' : 'COO';
    approveTransaction(id, roleName);
    toast.success('Expense approved successfully');
  };

  const handleReject = (id: string) => {
    if (!canApproveExpenses()) {
      toast.error("You don't have permission to reject expenses");
      return;
    }
    deleteTransaction(id);
    toast.success('Expense rejected and removed');
  };

  const handleDeleteClick = (id: string) => {
    setSelectedTransaction(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction);
      toast.success('Transaction deleted');
      setSelectedTransaction(null);
    }
  };

  const canManageFinance = canManage('finance');

  return (
    <DashboardLayout title="Finance & Invoicing" subtitle="Revenue, expenses and cash flow management">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            onClick={() => toast.info('Export feature coming soon')}
            className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        {canManageFinance && (
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setIncomeDialogOpen(true)}
              className="h-10 px-4 bg-success/10 text-success border border-success/30 font-medium rounded-lg flex items-center gap-2 hover:bg-success/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
            <button 
              onClick={() => setExpenseDialogOpen(true)}
              className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Record Expense
            </button>
          </div>
        )}
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="glass-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-success" />
            </div>
            <span className="flex items-center gap-1 text-xs md:text-sm text-success">
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
              +18.2%
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-lg md:text-2xl font-bold text-foreground mt-1">${stats.totalIncome.toLocaleString()}</p>
        </div>

        <div className="glass-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-destructive" />
            </div>
            <span className="flex items-center gap-1 text-xs md:text-sm text-destructive">
              <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4" />
              +5.1%
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-lg md:text-2xl font-bold text-foreground mt-1">${stats.totalExpenses.toLocaleString()}</p>
        </div>

        <div className="glass-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <span className="flex items-center gap-1 text-xs md:text-sm text-success">
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
              +22.4%
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Net Profit</p>
          <p className="text-lg md:text-2xl font-bold text-foreground mt-1">${stats.netProfit.toLocaleString()}</p>
        </div>

        <div className="glass-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-warning" />
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-lg md:text-2xl font-bold text-foreground mt-1">${stats.pendingExpenses.toLocaleString()}</p>
          <p className="text-[10px] md:text-xs text-warning mt-1">{stats.pendingCount} expenses awaiting</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 glass-card p-4 md:p-6">
          <h3 className="font-semibold text-foreground mb-4">Cash Flow</h3>
          <div className="h-48 md:h-64">
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
        <div className="glass-card p-4 md:p-6">
          <h3 className="font-semibold text-foreground mb-4">Revenue by Service</h3>
          <div className="h-40 md:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByService}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
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
          <div className="space-y-1.5 mt-4 max-h-32 overflow-y-auto">
            {revenueByService.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Approvals - Only for CEO/COO */}
      {canApproveExpenses() && (
        <div className="glass-card overflow-hidden mb-6">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Pending Expense Approvals</h3>
            <span className="badge-warning">{transactions.filter(t => t.status === 'pending').length} pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.filter(t => t.status === 'pending').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted-foreground py-8">
                      No pending expenses to approve
                    </td>
                  </tr>
                ) : (
                  transactions.filter(t => t.status === 'pending').map((tx) => (
                    <tr key={tx.id}>
                      <td className="font-medium text-foreground">{tx.description}</td>
                      <td className="text-muted-foreground">{tx.category}</td>
                      <td className="text-muted-foreground">{tx.date}</td>
                      <td className="text-right font-medium text-destructive">
                        -${tx.amount.toLocaleString()}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(tx.id)}
                            className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(tx.id)}
                            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Transactions - Desktop */}
      <div className="glass-card overflow-hidden hidden lg:block">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">All Transactions</h3>
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
                {canManageFinance && <th className="text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={canManageFinance ? 6 : 5} className="text-center text-muted-foreground py-8">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
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
                        {tx.approvedBy && ` (${tx.approvedBy})`}
                      </span>
                    </td>
                    <td className={cn(
                      'text-right font-medium',
                      tx.type === 'income' ? 'text-success' : 'text-destructive'
                    )}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                    {canManageFinance && (
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeleteClick(tx.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete"
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

      {/* Transactions Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        <h3 className="font-semibold text-foreground">All Transactions</h3>
        {filteredTransactions.length === 0 ? (
          <div className="glass-card p-6 text-center text-muted-foreground">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="glass-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">{tx.category}</p>
                </div>
                <span className={cn(
                  tx.status === 'completed' && 'badge-success',
                  tx.status === 'pending' && 'badge-warning',
                  tx.status === 'approved' && 'badge-info'
                )}>
                  {tx.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className="text-sm text-muted-foreground">{tx.date}</span>
                <span className={cn(
                  'font-semibold',
                  tx.type === 'income' ? 'text-success' : 'text-destructive'
                )}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </span>
              </div>
              {canManageFinance && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                  {tx.status === 'pending' && canApproveExpenses() && (
                    <>
                      <button
                        onClick={() => handleApprove(tx.id)}
                        className="flex-1 py-2 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(tx.id)}
                        className="flex-1 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteClick(tx.id)}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Dialogs */}
      <AddTransactionDialog
        open={incomeDialogOpen}
        onOpenChange={setIncomeDialogOpen}
        type="income"
      />
      <AddTransactionDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        type="expense"
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </DashboardLayout>
  );
}