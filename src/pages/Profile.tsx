import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Calendar, 
  Edit, 
  Save,
  Camera,
  Key,
  Bell,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+237 699 000 000',
    department: 'Direction',
    position: 'Directeur',
    joinDate: 'Janvier 2022',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success(t('profile.saved'));
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('profile.passwordMismatch'));
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error(t('profile.passwordTooShort'));
      return;
    }
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success(t('profile.passwordChanged'));
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      ceo: 'bg-primary/20 text-primary',
      coo: 'bg-accent/20 text-accent',
      cto: 'bg-success/20 text-success',
      media_manager: 'bg-warning/20 text-warning',
      admin: 'bg-muted text-muted-foreground',
    };
    return <Badge className={`${roleColors[role] || roleColors.admin} border-0`}>{t(`roles.${role}`)}</Badge>;
  };

  const activityLog = [
    { action: t('profile.loginAction'), date: '08 Jan 2026, 09:15', icon: CheckCircle2 },
    { action: t('profile.settingsChanged'), date: '07 Jan 2026, 14:30', icon: Edit },
    { action: t('profile.documentUploaded'), date: '06 Jan 2026, 11:45', icon: CheckCircle2 },
    { action: t('profile.passwordChanged'), date: '01 Jan 2026, 10:00', icon: Key },
  ];

  return (
    <DashboardLayout title={t('profile.title')} subtitle={t('profile.subtitle')}>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            {t('profile.info')}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            {t('profile.security')}
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Clock className="w-4 h-4" />
            {t('profile.activity')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carte Profil */}
            <Card className="glass-card lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-semibold text-foreground">{user?.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
                {user?.role && getRoleBadge(user.role)}
                
                <div className="mt-6 pt-6 border-t border-border space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t('profile.department')}:</span>
                    <span className="text-foreground">{profileData.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t('profile.joined')}:</span>
                    <span className="text-foreground">{profileData.joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations détaillées */}
            <Card className="glass-card lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('profile.personalInfo')}</CardTitle>
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className="gap-2"
                >
                  {isEditing ? (
                    <><Save className="w-4 h-4" /> {t('common.save')}</>
                  ) : (
                    <><Edit className="w-4 h-4" /> {t('common.edit')}</>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('common.name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('common.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('common.phone')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('profile.position')}</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={profileData.position}
                        disabled
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Changer mot de passe */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  {t('profile.changePassword')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('profile.currentPassword')}</Label>
                  <Input 
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('profile.newPassword')}</Label>
                  <Input 
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('profile.confirmPassword')}</Label>
                  <Input 
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <Button onClick={handleChangePassword} className="w-full">
                  {t('profile.updatePassword')}
                </Button>
              </CardContent>
            </Card>

            {/* Préférences de notification */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  {t('profile.notificationPrefs')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{t('profile.emailNotifs')}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.emailNotifsDesc')}</p>
                  </div>
                  <Badge className="bg-success/20 text-success border-0">{t('common.active')}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{t('profile.pushNotifs')}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.pushNotifsDesc')}</p>
                  </div>
                  <Badge className="bg-success/20 text-success border-0">{t('common.active')}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{t('profile.smsNotifs')}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.smsNotifsDesc')}</p>
                  </div>
                  <Badge className="bg-muted text-muted-foreground border-0">{t('common.inactive')}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t('profile.recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <activity.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
