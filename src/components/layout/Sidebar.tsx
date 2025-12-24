import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Video,
  GraduationCap,
  DollarSign,
  UserCog,
  FileText,
  Bell,
  Settings,
  LogOut,
  Building2,
  ChevronDown,
  Headphones,
  Film,
  Mic,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
  children?: { label: string; href: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    roles: ['ceo', 'coo', 'cto', 'media_manager', 'admin'],
  },
  {
    label: 'CRM',
    icon: Users,
    href: '/crm',
    roles: ['ceo', 'coo', 'admin'],
  },
  {
    label: 'Spaces',
    icon: Building2,
    href: '/spaces',
    roles: ['ceo', 'coo', 'admin'],
  },
  {
    label: 'Media Production',
    icon: Video,
    href: '/media',
    roles: ['ceo', 'coo', 'media_manager'],
    children: [
      { label: 'Audio', href: '/media/audio', icon: Headphones },
      { label: 'Video', href: '/media/video', icon: Film },
      { label: 'Podcasts', href: '/media/podcasts', icon: Mic },
    ],
  },
  {
    label: 'Student Programs',
    icon: GraduationCap,
    href: '/students',
    roles: ['ceo', 'coo', 'admin'],
  },
  {
    label: 'Finance',
    icon: DollarSign,
    href: '/finance',
    roles: ['ceo', 'coo'],
  },
  {
    label: 'HR & Team',
    icon: UserCog,
    href: '/hr',
    roles: ['ceo', 'coo', 'cto'],
  },
  {
    label: 'Documents',
    icon: FileText,
    href: '/documents',
    roles: ['ceo', 'coo', 'cto', 'admin'],
  },
  {
    label: 'Notifications',
    icon: Bell,
    href: '/notifications',
    roles: ['ceo', 'coo', 'cto', 'media_manager', 'admin'],
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    roles: ['cto'],
  },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const filteredNavItems = navItems.filter(item =>
    user ? item.roles.includes(user.role) : false
  );

  const roleLabels: Record<UserRole, string> = {
    ceo: 'Chief Executive',
    coo: 'Chief Operations',
    cto: 'Chief Technology',
    media_manager: 'Media Manager',
    admin: 'Administration',
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-foreground">WDH-OS</h1>
          <p className="text-xs text-muted-foreground">Operating System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href || 
              location.pathname.startsWith(item.href + '/');
            const isExpanded = expandedItems.includes(item.label);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <li key={item.label}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className={cn(
                        'sidebar-link w-full justify-between',
                        isActive && 'active'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <li key={child.href}>
                            <Link
                              to={child.href}
                              className={cn(
                                'sidebar-link text-sm',
                                location.pathname === child.href && 'active'
                              )}
                            >
                              <child.icon className="w-4 h-4" />
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={cn('sidebar-link', isActive && 'active')}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.role && roleLabels[user.role]}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="sidebar-link w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
