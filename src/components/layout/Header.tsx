import { Bell, Search, Settings, Menu, Globe, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-3 sm:px-4 md:px-8 py-3 md:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 hidden sm:block truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          {/* Search - hidden on mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('common.search')}
              className="w-40 lg:w-64 h-9 lg:h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Language Switcher - icon only on small screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setLanguage('fr')}
                className={language === 'fr' ? 'bg-primary/10 text-primary' : ''}
              >
                🇫🇷 Français
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-primary/10 text-primary' : ''}
              >
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>

          {/* Notifications */}
          <Link to="/notifications" className="relative p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full" />
          </Link>

          {/* Settings - hidden on small screens */}
          <Link to="/settings" className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </Link>

          {/* User Avatar */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer flex-shrink-0">
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}