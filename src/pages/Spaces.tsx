import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Users, Clock, DollarSign, Calendar, List, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore, Booking } from '@/stores/appStore';
import { usePermissions } from '@/hooks/usePermissions';
import { useLanguage } from '@/contexts/LanguageContext';
import { AddBookingDialog } from '@/components/dialogs/AddBookingDialog';
import { BookingCalendar } from '@/components/spaces/BookingCalendar';
import { InvoiceDialog } from '@/components/dialogs/InvoiceDialog';
import { exportToCSV } from '@/utils/exportData';
import { createInvoiceFromBooking } from '@/utils/generateInvoice';
import { InvoiceData } from '@/components/invoice/InvoiceTemplate';
import { toast } from 'sonner';

export default function Spaces() {
  const { t } = useLanguage();
  const { spaces, bookings, updateSpace } = useAppStore();
  const { canManage } = usePermissions();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);

  const todayBookings = spaces.filter(s => s.status === 'occupied' || s.status === 'reserved').length;
  const occupancyRate = Math.round((todayBookings / spaces.length) * 100);
  const availableSpaces = spaces.filter(s => s.status === 'available').length;

  const statusConfig: Record<string, { label: string; class: string }> = {
    available: { label: t('spaces.available'), class: 'bg-success/20 text-success border-success/30' },
    occupied: { label: t('spaces.occupied'), class: 'bg-destructive/20 text-destructive border-destructive/30' },
    reserved: { label: t('spaces.reserved'), class: 'bg-warning/20 text-warning border-warning/30' },
    maintenance: { label: t('spaces.maintenance'), class: 'bg-muted text-muted-foreground border-border' },
  };

  const typeIcons: Record<string, string> = {
    office: '🏢',
    conference: '👥',
    coworking: '💻',
    studio: '🎙️',
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'office': return t('spaces.office');
      case 'conference': return t('spaces.conference');
      case 'coworking': return t('spaces.coworking');
      case 'studio': return t('spaces.studio');
      default: return type;
    }
  };

  const handleBookNow = (spaceId: string) => {
    if (!canManage('spaces')) {
      toast.error(t('media.noPermission'));
      return;
    }
    setBookingDialogOpen(true);
  };

  const handleSetMaintenance = (spaceId: string) => {
    if (!canManage('spaces')) {
      toast.error(t('media.noPermission'));
      return;
    }
    updateSpace(spaceId, { status: 'maintenance', currentBooking: undefined });
    toast.success(t('common.success'));
  };

  const handleSetAvailable = (spaceId: string) => {
    if (!canManage('spaces')) {
      toast.error(t('media.noPermission'));
      return;
    }
    updateSpace(spaceId, { status: 'available', currentBooking: undefined });
    toast.success(t('common.success'));
  };

  const handleExportBookings = () => {
    const allBookings = [
      ...bookings.map(b => ({
        spaceName: b.spaceName,
        clientName: b.clientName,
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status,
        totalPrice: b.totalPrice
      })),
      ...spaces.filter(s => s.currentBooking).map(space => ({
        spaceName: space.name,
        clientName: space.currentBooking?.client || '',
        date: space.currentBooking?.date || '',
        startTime: '09:00',
        endTime: space.currentBooking?.until || '',
        status: 'confirmed',
        totalPrice: space.pricePerHour * 8
      }))
    ];

    exportToCSV(allBookings, `reservations_${new Date().toISOString().split('T')[0]}`, [
      { key: 'spaceName', label: 'Espace' },
      { key: 'clientName', label: 'Client' },
      { key: 'date', label: 'Date' },
      { key: 'startTime', label: 'Heure début' },
      { key: 'endTime', label: 'Heure fin' },
      { key: 'status', label: 'Statut' },
      { key: 'totalPrice', label: 'Prix' }
    ]);
    toast.success(t('common.export') + ' ✓');
  };

  const handleGenerateInvoice = (booking: Booking) => {
    const invoice = createInvoiceFromBooking({
      spaceName: booking.spaceName,
      clientName: booking.clientName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      totalPrice: booking.totalPrice
    });
    setCurrentInvoice(invoice);
    setInvoiceDialogOpen(true);
  };

  return (
    <DashboardLayout title={t('spaces.title')} subtitle={t('spaces.subtitle')}>
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-3">
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "h-10 px-4 border border-border rounded-lg text-sm flex items-center gap-2 transition-colors",
              viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground hover:bg-muted'
            )}
          >
            <List className="w-4 h-4" />
            {t('spaces.listView')}
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={cn(
              "h-10 px-4 border border-border rounded-lg text-sm flex items-center gap-2 transition-colors",
              viewMode === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground hover:bg-muted'
            )}
          >
            <Calendar className="w-4 h-4" />
            {t('spaces.calendarView')}
          </button>
          <button 
            onClick={handleExportBookings}
            className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('common.export')}
          </button>
        </div>
        {canManage('spaces') && (
          <button 
            onClick={() => setBookingDialogOpen(true)}
            className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            {t('spaces.newBooking')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">{t('spaces.todaysBookings')}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{todayBookings}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">{t('spaces.occupancyRate')}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{occupancyRate}%</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${occupancyRate}%` }} />
          </div>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">{t('spaces.revenueToday')}</p>
          <p className="text-2xl font-bold text-foreground mt-1">$1,245</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">{t('spaces.availableNow')}</p>
          <p className="text-2xl font-bold text-success mt-1">{availableSpaces} {t('spaces.studio').toLowerCase()}s</p>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <BookingCalendar />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => {
            const status = statusConfig[space.status];
            return (
              <div key={space.id} className="glass-card p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{typeIcons[space.type]}</div>
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', status.class)}>
                    {status.label}
                  </span>
                </div>

                <h3 className="font-semibold text-foreground mb-1">{space.name}</h3>
                <p className="text-sm text-muted-foreground capitalize mb-4">{getTypeLabel(space.type)}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm font-medium text-foreground">{space.capacity}</p>
                    <p className="text-xs text-muted-foreground">{t('spaces.capacity')}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <DollarSign className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm font-medium text-foreground">${space.pricePerHour}</p>
                    <p className="text-xs text-muted-foreground">/h</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm font-medium text-foreground">24/7</p>
                    <p className="text-xs text-muted-foreground">{t('spaces.access')}</p>
                  </div>
                </div>

                {space.currentBooking && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50 mb-4">
                    <p className="text-sm text-foreground font-medium">{space.currentBooking.client}</p>
                    <p className="text-xs text-muted-foreground">{t('spaces.until')} {space.currentBooking.until}</p>
                  </div>
                )}

                {space.status === 'available' && canManage('spaces') && (
                  <button 
                    onClick={() => handleBookNow(space.id)}
                    className="w-full h-9 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    {t('spaces.bookNow')}
                  </button>
                )}
                
                {space.status === 'maintenance' && canManage('spaces') && (
                  <button 
                    onClick={() => handleSetAvailable(space.id)}
                    className="w-full h-9 bg-success/10 text-success font-medium rounded-lg hover:bg-success/20 transition-colors"
                  >
                    {t('spaces.setAvailable')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddBookingDialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen} />
      <InvoiceDialog 
        open={invoiceDialogOpen} 
        onOpenChange={setInvoiceDialogOpen} 
        invoiceData={currentInvoice}
      />
    </DashboardLayout>
  );
}
