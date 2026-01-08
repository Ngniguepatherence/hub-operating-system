import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStore } from '@/stores/appStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Receipt, 
  TrendingUp, 
  Calendar, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';

interface TaxDeclaration {
  id: string;
  period: string;
  type: 'igs' | 'tva' | 'patente' | 'cnps';
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

const mockDeclarations: TaxDeclaration[] = [
  { id: '1', period: 'Dec 2024', type: 'igs', amount: 245000, dueDate: '2025-01-15', status: 'pending' },
  { id: '2', period: 'Dec 2024', type: 'cnps', amount: 189000, dueDate: '2025-01-15', status: 'pending' },
  { id: '3', period: 'Q4 2024', type: 'tva', amount: 520000, dueDate: '2025-01-20', status: 'pending' },
  { id: '4', period: 'Nov 2024', type: 'igs', amount: 238000, dueDate: '2024-12-15', status: 'paid', paidDate: '2024-12-14' },
  { id: '5', period: 'Nov 2024', type: 'cnps', amount: 185000, dueDate: '2024-12-15', status: 'paid', paidDate: '2024-12-14' },
  { id: '6', period: '2024', type: 'patente', amount: 750000, dueDate: '2024-03-31', status: 'paid', paidDate: '2024-03-28' },
];

export function TaxManagement() {
  const { t } = useLanguage();
  const { employees } = useAppStore();
  const [declarations, setDeclarations] = useState<TaxDeclaration[]>(mockDeclarations);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [filterType, setFilterType] = useState<string>('all');

  const activeEmployees = employees.filter(e => e.status === 'active');
  const totalSalaries = activeEmployees.reduce((sum, e) => sum + e.salary, 0);

  // Calculs fiscaux mensuels estimés
  const estimatedMonthlyIGS = Math.round(totalSalaries * 0.15); // Estimation moyenne
  const estimatedMonthlyCNPS = Math.round(totalSalaries * (0.042 + 0.118)); // Employé + Employeur
  const estimatedQuarterlyTVA = 520000; // À ajuster selon revenus réels

  const pendingDeclarations = declarations.filter(d => d.status === 'pending');
  const overdueDeclarations = declarations.filter(d => d.status === 'overdue');
  const totalPending = pendingDeclarations.reduce((sum, d) => sum + d.amount, 0);

  const filteredDeclarations = declarations.filter(d => 
    filterType === 'all' || d.type === filterType
  );

  const markAsPaid = (id: string) => {
    setDeclarations(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0] } : d
    ));
    toast.success(t('tax.markedAsPaid'));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge className="bg-success/20 text-success border-0"><CheckCircle2 className="w-3 h-3 mr-1" />{t('tax.paid')}</Badge>;
      case 'pending': return <Badge className="bg-warning/20 text-warning border-0"><Clock className="w-3 h-3 mr-1" />{t('common.pending')}</Badge>;
      case 'overdue': return <Badge className="bg-destructive/20 text-destructive border-0"><AlertCircle className="w-3 h-3 mr-1" />{t('tax.overdue')}</Badge>;
      default: return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      igs: 'bg-primary/20 text-primary',
      tva: 'bg-accent/20 text-accent',
      patente: 'bg-warning/20 text-warning',
      cnps: 'bg-success/20 text-success',
    };
    return <Badge className={`${colors[type]} border-0`}>{type.toUpperCase()}</Badge>;
  };

  const exportDeclarations = () => {
    const csvContent = [
      ['Période', 'Type', 'Montant', 'Échéance', 'Statut', 'Date Paiement'].join(','),
      ...filteredDeclarations.map(d => [
        d.period,
        d.type.toUpperCase(),
        d.amount,
        d.dueDate,
        d.status,
        d.paidDate || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `declarations_fiscales_${selectedYear}.csv`;
    a.click();
    toast.success(t('common.export'));
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {t('tax.management')}
          </h2>
          <p className="text-sm text-muted-foreground">{t('tax.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32 bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportDeclarations} className="gap-2">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-warning/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingDeclarations.length}</p>
                <p className="text-xs text-muted-foreground">{t('tax.pendingDeclarations')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-destructive/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalPending.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('tax.amountDue')} (FCFA)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estimatedMonthlyIGS.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('tax.estimatedIGS')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{estimatedMonthlyCNPS.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('tax.estimatedCNPS')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes */}
      {pendingDeclarations.length > 0 && (
        <Card className="glass-card border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">{t('tax.upcomingDeadlines')}</h4>
                <div className="mt-2 space-y-2">
                  {pendingDeclarations.slice(0, 3).map(d => (
                    <div key={d.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {getTypeBadge(d.type)} {d.period} - {d.amount.toLocaleString()} FCFA
                      </span>
                      <span className="text-warning font-medium">{t('tax.due')}: {d.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des déclarations */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{t('tax.declarations')}</CardTitle>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              <SelectItem value="igs">IGS</SelectItem>
              <SelectItem value="tva">TVA</SelectItem>
              <SelectItem value="cnps">CNPS</SelectItem>
              <SelectItem value="patente">Patente</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tax.period')}</TableHead>
                  <TableHead>{t('tax.type')}</TableHead>
                  <TableHead className="text-right">{t('finance.amount')}</TableHead>
                  <TableHead>{t('tax.dueDate')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeclarations.map((declaration) => (
                  <TableRow key={declaration.id}>
                    <TableCell className="font-medium">{declaration.period}</TableCell>
                    <TableCell>{getTypeBadge(declaration.type)}</TableCell>
                    <TableCell className="text-right font-mono">{declaration.amount.toLocaleString()} FCFA</TableCell>
                    <TableCell>{declaration.dueDate}</TableCell>
                    <TableCell>{getStatusBadge(declaration.status)}</TableCell>
                    <TableCell>
                      {declaration.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => markAsPaid(declaration.id)}
                          className="gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {t('tax.markPaid')}
                        </Button>
                      )}
                      {declaration.status === 'paid' && (
                        <span className="text-sm text-muted-foreground">{declaration.paidDate}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Barèmes IGS */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t('tax.igsBrackets')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t('tax.igsBracketsDescription')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { range: '0 - 62 000 FCFA', rate: '0%', color: 'bg-success/20' },
                { range: '62 001 - 200 000 FCFA', rate: '10%', color: 'bg-primary/20' },
                { range: '200 001 - 400 000 FCFA', rate: '15%', color: 'bg-primary/30' },
                { range: '400 001 - 600 000 FCFA', rate: '25%', color: 'bg-warning/20' },
                { range: '600 001 - 1 000 000 FCFA', rate: '30%', color: 'bg-warning/30' },
                { range: '> 1 000 000 FCFA', rate: '35%', color: 'bg-destructive/20' },
              ].map((bracket, i) => (
                <div key={i} className={`p-4 rounded-lg ${bracket.color}`}>
                  <p className="font-medium text-foreground">{bracket.range}</p>
                  <p className="text-2xl font-bold text-foreground">{bracket.rate}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
