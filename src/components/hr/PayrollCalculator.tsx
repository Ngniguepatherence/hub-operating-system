import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStore } from '@/stores/appStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Calculator, Download, DollarSign, Users, Percent, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Barèmes IGS Cameroun (simplifié)
const IGS_BRACKETS = [
  { min: 0, max: 62000, rate: 0, fixed: 0 },
  { min: 62001, max: 200000, rate: 0.10, fixed: 0 },
  { min: 200001, max: 400000, rate: 0.15, fixed: 13800 },
  { min: 400001, max: 600000, rate: 0.25, fixed: 43800 },
  { min: 600001, max: 1000000, rate: 0.30, fixed: 93800 },
  { min: 1000001, max: Infinity, rate: 0.35, fixed: 213800 },
];

// Taux de cotisations sociales
const CNPS_EMPLOYEE_RATE = 0.042; // 4.2%
const CNPS_EMPLOYER_RATE = 0.118; // 11.8%

interface PayrollEntry {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  bonus: number;
  overtime: number;
  grossSalary: number;
  igsAmount: number;
  cnpsEmployee: number;
  cnpsEmployer: number;
  totalDeductions: number;
  netSalary: number;
}

export function PayrollCalculator() {
  const { t } = useLanguage();
  const { employees } = useAppStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([]);
  const [bonuses, setBonuses] = useState<Record<string, number>>({});
  const [overtimes, setOvertimes] = useState<Record<string, number>>({});

  const activeEmployees = employees.filter(e => e.status === 'active');

  const calculateIGS = (grossSalary: number): number => {
    for (const bracket of IGS_BRACKETS) {
      if (grossSalary >= bracket.min && grossSalary <= bracket.max) {
        if (bracket.rate === 0) return 0;
        return bracket.fixed + (grossSalary - bracket.min) * bracket.rate;
      }
    }
    return 0;
  };

  const calculatePayroll = () => {
    const entries: PayrollEntry[] = activeEmployees.map(employee => {
      const baseSalary = employee.salary;
      const bonus = bonuses[employee.id] || 0;
      const overtime = overtimes[employee.id] || 0;
      const grossSalary = baseSalary + bonus + overtime;
      
      const igsAmount = calculateIGS(grossSalary);
      const cnpsEmployee = Math.round(grossSalary * CNPS_EMPLOYEE_RATE);
      const cnpsEmployer = Math.round(grossSalary * CNPS_EMPLOYER_RATE);
      const totalDeductions = igsAmount + cnpsEmployee;
      const netSalary = grossSalary - totalDeductions;

      return {
        employeeId: employee.id,
        employeeName: employee.name,
        baseSalary,
        bonus,
        overtime,
        grossSalary,
        igsAmount: Math.round(igsAmount),
        cnpsEmployee,
        cnpsEmployer,
        totalDeductions,
        netSalary,
      };
    });

    setPayrollData(entries);
    toast.success(t('hr.payrollCalculated'));
  };

  const exportPayroll = () => {
    const csvContent = [
      ['Employé', 'Salaire Base', 'Prime', 'Heures Sup', 'Brut', 'IGS', 'CNPS', 'Net'].join(','),
      ...payrollData.map(p => [
        p.employeeName,
        p.baseSalary,
        p.bonus,
        p.overtime,
        p.grossSalary,
        p.igsAmount,
        p.cnpsEmployee,
        p.netSalary
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paie_${selectedMonth}.csv`;
    a.click();
    toast.success(t('hr.payrollExported'));
  };

  const totalGross = payrollData.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalNet = payrollData.reduce((sum, p) => sum + p.netSalary, 0);
  const totalIGS = payrollData.reduce((sum, p) => sum + p.igsAmount, 0);
  const totalCNPS = payrollData.reduce((sum, p) => sum + p.cnpsEmployee + p.cnpsEmployer, 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            {t('hr.payrollManagement')}
          </h2>
          <p className="text-sm text-muted-foreground">{t('hr.payrollSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40 bg-muted/50"
          />
          <Button onClick={calculatePayroll} className="gap-2">
            <Calculator className="w-4 h-4" />
            {t('hr.calculate')}
          </Button>
          {payrollData.length > 0 && (
            <Button variant="outline" onClick={exportPayroll} className="gap-2">
              <Download className="w-4 h-4" />
              {t('common.export')}
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeEmployees.length}</p>
                <p className="text-xs text-muted-foreground">{t('hr.activeEmployees')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalGross.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('hr.totalGross')} (FCFA)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Percent className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalIGS.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('hr.totalIGS')} (FCFA)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalNet.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t('hr.totalNet')} (FCFA)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saisie des primes et heures sup */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('hr.additionalPay')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEmployees.map(employee => (
              <div key={employee.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{employee.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.salary.toLocaleString()} FCFA</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">{t('hr.bonus')}</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={bonuses[employee.id] || ''}
                      onChange={(e) => setBonuses({ ...bonuses, [employee.id]: Number(e.target.value) })}
                      className="h-8 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t('hr.overtime')}</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={overtimes[employee.id] || ''}
                      onChange={(e) => setOvertimes({ ...overtimes, [employee.id]: Number(e.target.value) })}
                      className="h-8 text-sm bg-background"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tableau de paie */}
      {payrollData.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">{t('hr.payrollDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.name')}</TableHead>
                    <TableHead className="text-right">{t('hr.baseSalary')}</TableHead>
                    <TableHead className="text-right">{t('hr.bonus')}</TableHead>
                    <TableHead className="text-right">{t('hr.grossSalary')}</TableHead>
                    <TableHead className="text-right">{t('hr.igs')}</TableHead>
                    <TableHead className="text-right">{t('hr.cnps')}</TableHead>
                    <TableHead className="text-right">{t('hr.netSalary')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((entry) => (
                    <TableRow key={entry.employeeId}>
                      <TableCell className="font-medium">{entry.employeeName}</TableCell>
                      <TableCell className="text-right">{entry.baseSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{(entry.bonus + entry.overtime).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{entry.grossSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-destructive">-{entry.igsAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-destructive">-{entry.cnpsEmployee.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold text-success">{entry.netSalary.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>{t('common.total')}</TableCell>
                    <TableCell className="text-right">{payrollData.reduce((s, p) => s + p.baseSalary, 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{payrollData.reduce((s, p) => s + p.bonus + p.overtime, 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{totalGross.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-destructive">-{totalIGS.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-destructive">-{payrollData.reduce((s, p) => s + p.cnpsEmployee, 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-success">{totalNet.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info IGS */}
      <Card className="glass-card border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Percent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{t('hr.igsInfo')}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t('hr.igsDescription')}</p>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                <Badge variant="outline" className="justify-center">0 - 62 000: 0%</Badge>
                <Badge variant="outline" className="justify-center">62 001 - 200 000: 10%</Badge>
                <Badge variant="outline" className="justify-center">200 001 - 400 000: 15%</Badge>
                <Badge variant="outline" className="justify-center">400 001 - 600 000: 25%</Badge>
                <Badge variant="outline" className="justify-center">600 001 - 1M: 30%</Badge>
                <Badge variant="outline" className="justify-center">&gt; 1M: 35%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
