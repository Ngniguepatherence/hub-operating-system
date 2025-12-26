import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon,
  Globe,
  Palette,
  Bell,
  Shield,
  Building2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  
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
    toast.success(language === 'fr' ? 'Paramètres enregistrés' : 'Settings saved');
  };

  const handleSaveNotifications = () => {
    toast.success(language === 'fr' ? 'Préférences de notification mises à jour' : 'Notification preferences updated');
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
                {language === 'fr' 
                  ? 'Configurez les informations de base de votre entreprise'
                  : 'Configure your company basic information'}
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
                {language === 'fr' 
                  ? 'Personnalisez l\'apparence de la plateforme'
                  : 'Customize the platform appearance'}
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

              {/* Theme Colors Preview */}
              <div className="space-y-3">
                <Label>{language === 'fr' ? 'Couleurs du thème' : 'Theme Colors'}</Label>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border">
                    <div className="w-6 h-6 rounded-full bg-foreground"></div>
                    <span className="text-sm">{language === 'fr' ? 'Noir' : 'Black'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                    <span className="text-sm">{language === 'fr' ? 'Jaune' : 'Yellow'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
                    <div className="w-6 h-6 rounded-full bg-card border border-border"></div>
                    <span className="text-sm">{language === 'fr' ? 'Blanc' : 'White'}</span>
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
                {language === 'fr' 
                  ? 'Gérez vos préférences de notification'
                  : 'Manage your notification preferences'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{t('settings.emailNotifications')}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'fr' ? 'Recevoir des notifications par email' : 'Receive notifications via email'}
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
                      {language === 'fr' ? 'Notifications push dans le navigateur' : 'Push notifications in browser'}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{language === 'fr' ? 'Alertes de réservation' : 'Booking Alerts'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'fr' ? 'Nouvelles réservations d\'espaces' : 'New space bookings'}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.bookingAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, bookingAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{language === 'fr' ? 'Alertes de paiement' : 'Payment Alerts'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'fr' ? 'Paiements et transactions' : 'Payments and transactions'}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.paymentAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, paymentAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{language === 'fr' ? 'Mises à jour de projets' : 'Project Updates'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'fr' ? 'Changements de statut des projets' : 'Project status changes'}
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
                {language === 'fr' 
                  ? 'Paramètres de sécurité et d\'accès'
                  : 'Security and access settings'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' 
                    ? 'Les paramètres de sécurité avancés seront disponibles après la connexion à Lovable Cloud.'
                    : 'Advanced security settings will be available after connecting to Lovable Cloud.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
