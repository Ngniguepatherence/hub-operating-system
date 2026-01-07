import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe,
  Palette,
  Bell,
  Shield,
  Building2,
  Save,
  Sun,
  Moon
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const [companySettings, setCompanySettings] = useState({
    name: 'West Digital Hub',
    address: 'Douala, Cameroon',
    phone: '+237 699 000 000',
    email: 'contact@westdigitalhub.com',
    timezone: 'Africa/Douala',
    currency: 'XAF',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bookingAlerts: true,
    paymentAlerts: true,
    projectUpdates: true,
  });

  const handleSaveGeneral = () => {
    toast.success(t('settings.settingsSaved'));
  };

  const handleSaveNotifications = () => {
    toast.success(t('settings.notificationPrefsUpdated'));
  };

  return (
    <DashboardLayout title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('settings.general')}</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">{t('settings.appearance')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">{t('settings.notifications')}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">{t('settings.security')}</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                {t('settings.companyInfo')}
              </CardTitle>
              <CardDescription>
                {t('settings.configureBasicInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">{t('settings.companyName')}</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('common.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('common.phone')}</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t('settings.address')}</Label>
                  <Input
                    id="address"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">{t('settings.timezone')}</Label>
                  <Input
                    id="timezone"
                    value={companySettings.timezone}
                    onChange={(e) => setCompanySettings({ ...companySettings, timezone: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t('settings.currency')}</Label>
                  <Input
                    id="currency"
                    value={companySettings.currency}
                    onChange={(e) => setCompanySettings({ ...companySettings, currency: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
              </div>
              <Button onClick={handleSaveGeneral} className="gap-2">
                <Save className="w-4 h-4" />
                {t('common.save')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                {t('settings.appearance')}
              </CardTitle>
              <CardDescription>
                {t('settings.customizeAppearance')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t('settings.language')}
                </Label>
                <div className="flex gap-3">
                  <Button
                    variant={language === 'fr' ? 'default' : 'outline'}
                    onClick={() => setLanguage('fr')}
                    className="flex-1"
                  >
                    🇫🇷 {t('settings.french')}
                  </Button>
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                    className="flex-1"
                  >
                    🇬🇧 {t('settings.english')}
                  </Button>
                </div>
              </div>

              {/* Theme Mode */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  {t('settings.theme')}
                </Label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="flex-1 min-w-[120px] gap-2"
                  >
                    <Sun className="w-4 h-4" />
                    {t('settings.lightMode')}
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="flex-1 min-w-[120px] gap-2"
                  >
                    <Moon className="w-4 h-4" />
                    {t('settings.darkMode')}
                  </Button>
                </div>
              </div>

              {/* Theme Colors Preview */}
              <div className="space-y-3">
                <Label>{t('settings.themeColors')}</Label>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border">
                    <div className="w-6 h-6 rounded-full bg-foreground"></div>
                    <span className="text-sm">{theme === 'dark' ? t('settings.white') : t('settings.black')}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                    <span className="text-sm">{t('settings.yellow')}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
                    <div className="w-6 h-6 rounded-full bg-card border border-border"></div>
                    <span className="text-sm">{theme === 'dark' ? t('settings.black') : t('settings.white')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                {t('settings.notifications')}
              </CardTitle>
              <CardDescription>
                {t('settings.manageNotificationPrefs')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{t('settings.emailNotifications')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.receiveEmailNotifs')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{t('settings.pushNotifications')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.pushNotifsInBrowser')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{t('settings.bookingAlerts')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.newSpaceBookings')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.bookingAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, bookingAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{t('settings.paymentAlerts')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.paymentsTransactions')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.paymentAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, paymentAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{t('settings.projectUpdates')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.projectStatusChanges')}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.projectUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, projectUpdates: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="gap-2">
                <Save className="w-4 h-4" />
                {t('common.save')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                {t('settings.security')}
              </CardTitle>
              <CardDescription>
                {t('settings.securityAccessSettings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <p className="text-sm text-muted-foreground">
                  {t('settings.advancedSecurityInfo')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
