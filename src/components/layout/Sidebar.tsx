import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  labelKey: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
  children?: { labelKey: string; href: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  {
    labelKey: 'nav.dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    roles: ['ceo', 'coo', 'cto', 'media_manager', 'admin'],
  },
  {
    labelKey: 'nav.crm',
    icon: Users,
    href: '/crm',
    roles: ['ceo', 'coo', 'admin'],
  },
  {
    labelKey: 'nav.spaces',
    icon: Building2,
    href: '/spaces',
    roles: ['ceo', 'coo', 'admin'],
  },
  {
    labelKey: 'nav.media',
    icon: Video,
    href: '/media',
    roles: ['ceo', 'coo', 'media_manager'],
    children: [
      { labelKey: 'nav.audio', href: '/media/audio', icon: Headphones },
      { labelKey: 'nav.video', href: '/media/video', icon: Film },
      { labelKey: 'nav.podcasts', href: '/media/podcasts', icon: Mic },
    ],
  },
  {
    labelKey: 'nav.students',
    icon: GraduationCap,
    href: '/students',
    roles: ['ceo', 'coo', 'admin'],
  },
  {
    labelKey: 'nav.finance',
    icon: DollarSign,
    href: '/finance',
    roles: ['ceo', 'coo'],
  },
  {
    labelKey: 'nav.hr',
    icon: UserCog,
    href: '/hr',
    roles: ['ceo', 'coo', 'cto'],
  },
  {
    labelKey: 'nav.documents',
    icon: FileText,
    href: '/documents',
    roles: ['ceo', 'coo', 'cto', 'admin'],
  },
  {
    labelKey: 'nav.notifications',
    icon: Bell,
    href: '/notifications',
    roles: ['ceo', 'coo', 'cto', 'media_manager', 'admin'],
  },
  {
    labelKey: 'nav.settings',
    icon: Settings,
    href: '/settings',
    roles: ['ceo', 'coo', 'cto'],
  },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (labelKey: string) => {
    setExpandedItems(prev =>
      prev.includes(labelKey)
        ? prev.filter(item => item !== labelKey)
        : [...prev, labelKey]
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex-col hidden lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-foreground">WDH-OS</h1>
          <p className="text-xs text-muted-foreground">West Digital Hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href || 
              location.pathname.startsWith(item.href + '/');
            const isExpanded = expandedItems.includes(item.labelKey);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <li key={item.labelKey}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.labelKey)}
                      className={cn(
                        'sidebar-link w-full justify-between',
                        isActive && 'active'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {t(item.labelKey)}
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
                              {t(child.labelKey)}
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
                    {t(item.labelKey)}
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
          <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
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
          {t('common.logout')}
        </button>
      </div>
    </aside>
  );
}