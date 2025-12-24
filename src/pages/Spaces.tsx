import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Users, Clock, DollarSign, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Space {
  id: string;
  name: string;
  type: 'office' | 'conference' | 'coworking' | 'studio';
  capacity: number;
  pricePerHour: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  currentBooking?: {
    client: string;
    until: string;
  };
}

const spaces: Space[] = [
  {
    id: '1',
    name: 'Executive Office A',
    type: 'office',
    capacity: 4,
    pricePerHour: 25,
    status: 'occupied',
    currentBooking: { client: 'MTN Cameroon', until: '6:00 PM' },
  },
  {
    id: '2',
    name: 'Conference Room Alpha',
    type: 'conference',
    capacity: 20,
    pricePerHour: 50,
    status: 'available',
  },
  {
    id: '3',
    name: 'Coworking Zone 1',
    type: 'coworking',
    capacity: 30,
    pricePerHour: 10,
    status: 'occupied',
    currentBooking: { client: 'Various', until: '8:00 PM' },
  },
  {
    id: '4',
    name: 'Recording Studio',
    type: 'studio',
    capacity: 6,
    pricePerHour: 75,
    status: 'reserved',
    currentBooking: { client: 'Digital Creators CM', until: '4:00 PM' },
  },
  {
    id: '5',
    name: 'Conference Room Beta',
    type: 'conference',
    capacity: 12,
    pricePerHour: 35,
    status: 'maintenance',
  },
  {
    id: '6',
    name: 'Podcast Room',
    type: 'studio',
    capacity: 4,
    pricePerHour: 40,
    status: 'available',
  },
];

const statusConfig = {
  available: { label: 'Available', class: 'bg-success/20 text-success border-success/30' },
  occupied: { label: 'Occupied', class: 'bg-destructive/20 text-destructive border-destructive/30' },
  reserved: { label: 'Reserved', class: 'bg-warning/20 text-warning border-warning/30' },
  maintenance: { label: 'Maintenance', class: 'bg-muted text-muted-foreground border-border' },
};

const typeIcons = {
  office: '🏢',
  conference: '👥',
  coworking: '💻',
  studio: '🎙️',
};

export default function Spaces() {
  const todayBookings = 12;
  const occupancyRate = 78;

  return (
    <DashboardLayout title="Spaces Management" subtitle="Coworking, offices & room rentals">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-3">
          <button className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendar View
          </button>
        </div>
        <button className="h-10 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Today's Bookings</p>
          <p className="text-2xl font-bold text-foreground mt-1">{todayBookings}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Occupancy Rate</p>
          <p className="text-2xl font-bold text-foreground mt-1">{occupancyRate}%</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Revenue Today</p>
          <p className="text-2xl font-bold text-foreground mt-1">$1,245</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Available Now</p>
          <p className="text-2xl font-bold text-success mt-1">
            {spaces.filter(s => s.status === 'available').length} spaces
          </p>
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.map((space) => {
          const status = statusConfig[space.status];
          return (
            <div
              key={space.id}
              className="glass-card p-6 hover:border-primary/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{typeIcons[space.type]}</div>
                <span className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium border',
                  status.class
                )}>
                  {status.label}
                </span>
              </div>

              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {space.name}
              </h3>
              <p className="text-sm text-muted-foreground capitalize mb-4">{space.type}</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">{space.capacity}</p>
                  <p className="text-xs text-muted-foreground">Capacity</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <DollarSign className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">${space.pricePerHour}</p>
                  <p className="text-xs text-muted-foreground">/hour</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-medium text-foreground">24/7</p>
                  <p className="text-xs text-muted-foreground">Access</p>
                </div>
              </div>

              {space.currentBooking && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-sm text-foreground font-medium">{space.currentBooking.client}</p>
                  <p className="text-xs text-muted-foreground">Until {space.currentBooking.until}</p>
                </div>
              )}

              {space.status === 'available' && (
                <button className="w-full mt-4 h-9 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors">
                  Book Now
                </button>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
