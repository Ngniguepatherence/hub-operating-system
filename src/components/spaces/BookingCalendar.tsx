import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useAppStore, Booking } from '@/stores/appStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Clock, MapPin, User, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvoiceDialog } from '@/components/dialogs/InvoiceDialog';
import { createInvoiceFromBooking } from '@/utils/generateInvoice';
import { InvoiceData } from '@/components/invoice/InvoiceTemplate';

export function BookingCalendar() {
  const { t, language } = useLanguage();
  const { spaces, bookings } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
  const locale = language === 'fr' ? fr : enUS;

  // Get bookings for selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayBookings = bookings.filter(b => b.date === selectedDateStr);

  // Get spaces with current bookings for selected date
  const spacesWithBookings = spaces.filter(space => 
    space.currentBooking?.date === selectedDateStr
  );

  // Combine bookings from both sources
  const allBookingsForDate = [
    ...dayBookings,
    ...spacesWithBookings.map(space => ({
      id: `space-${space.id}`,
      spaceId: space.id,
      spaceName: space.name,
      clientId: space.currentBooking?.clientId || '',
      clientName: space.currentBooking?.client || '',
      date: selectedDateStr,
      startTime: '09:00',
      endTime: space.currentBooking?.until?.replace(' PM', ':00').replace(' AM', ':00') || '18:00',
      status: 'confirmed' as const,
      totalPrice: space.pricePerHour * 8,
    }))
  ];

  // Get dates with bookings for highlighting
  const datesWithBookings = new Set([
    ...bookings.map(b => b.date),
    ...spaces.filter(s => s.currentBooking?.date).map(s => s.currentBooking!.date)
  ]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/20 text-success border-success/30';
      case 'pending':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'cancelled':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleGenerateInvoice = (booking: typeof allBookingsForDate[0]) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="glass-card p-4">
        <h3 className="font-semibold text-foreground mb-4">{t('spaces.calendarView')}</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={locale}
          className="rounded-md pointer-events-auto"
          modifiers={{
            hasBooking: (date) => datesWithBookings.has(format(date, 'yyyy-MM-dd'))
          }}
          modifiersClassNames={{
            hasBooking: 'bg-primary/20 font-bold'
          }}
        />
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <span>{t('spaces.hasBookings') || 'Jour avec réservations'}</span>
        </div>
      </div>

      {/* Bookings for selected date */}
      <div className="lg:col-span-2 glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            {t('spaces.bookingsFor') || 'Réservations du'} {format(selectedDate, 'dd MMMM yyyy', { locale })}
          </h3>
          <span className="text-sm text-muted-foreground">
            {allBookingsForDate.length} {t('spaces.reservation') || 'réservation'}(s)
          </span>
        </div>

        {allBookingsForDate.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('spaces.noBookingsForDate') || 'Aucune réservation pour cette date'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allBookingsForDate.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{booking.spaceName}</span>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', getStatusStyle(booking.status))}>
                    {booking.status === 'confirmed' ? t('common.confirmed') || 'Confirmé' : 
                     booking.status === 'pending' ? t('common.pending') : t('common.cancelled') || 'Annulé'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{booking.clientName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {t('spaces.total') || 'Total'}: ${booking.totalPrice}
                  </span>
                  <button
                    onClick={() => handleGenerateInvoice(booking)}
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    title={t('invoice.generate')}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <InvoiceDialog 
        open={invoiceDialogOpen} 
        onOpenChange={setInvoiceDialogOpen} 
        invoiceData={currentInvoice}
      />
    </div>
  );
}
