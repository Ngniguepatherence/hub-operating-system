import { useAuth, UserRole } from '@/contexts/AuthContext';

type Permission = 
  | 'view_dashboard'
  | 'view_crm'
  | 'manage_clients'
  | 'view_spaces'
  | 'manage_spaces'
  | 'view_media'
  | 'manage_media'
  | 'view_students'
  | 'manage_students'
  | 'view_finance'
  | 'manage_finance'
  | 'approve_expenses'
  | 'view_hr'
  | 'manage_hr'
  | 'view_documents'
  | 'manage_documents'
  | 'view_notifications'
  | 'view_settings'
  | 'manage_settings';

// Document category permissions by role
type DocumentCategory = 'contracts' | 'invoices' | 'reports' | 'templates' | 'policies' | 'other';

const documentCategoryPermissions: Record<UserRole, DocumentCategory[]> = {
  ceo: ['contracts', 'invoices', 'reports', 'templates', 'policies', 'other'],
  coo: ['contracts', 'invoices', 'reports', 'templates', 'policies', 'other'],
  cto: ['templates', 'policies', 'other'],
  media_manager: ['templates', 'other'],
  admin: ['invoices', 'templates', 'other'],
};

const rolePermissions: Record<UserRole, Permission[]> = {
  ceo: [
    'view_dashboard',
    'view_crm',
    'manage_clients',
    'view_spaces',
    'manage_spaces',
    'view_media',
    'manage_media',
    'view_students',
    'manage_students',
    'view_finance',
    'manage_finance',
    'approve_expenses',
    'view_hr',
    'manage_hr',
    'view_documents',
    'manage_documents',
    'view_notifications',
    'view_settings',
    'manage_settings',
  ],
  coo: [
    'view_dashboard',
    'view_crm',
    'manage_clients',
    'view_spaces',
    'manage_spaces',
    'view_media',
    'manage_media',
    'view_students',
    'manage_students',
    'view_finance',
    'manage_finance',
    'approve_expenses',
    'view_hr',
    'manage_hr',
    'view_documents',
    'manage_documents',
    'view_notifications',
  ],
  cto: [
    'view_dashboard',
    'view_hr',
    'manage_hr',
    'view_documents',
    'manage_documents',
    'view_notifications',
    'view_settings',
    'manage_settings',
  ],
  media_manager: [
    'view_dashboard',
    'view_media',
    'manage_media',
    'view_documents',
    'view_notifications',
  ],
  admin: [
    'view_dashboard',
    'view_crm',
    'manage_clients',
    'view_spaces',
    'manage_spaces',
    'view_students',
    'manage_students',
    'view_documents',
    'view_notifications',
  ],
};

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user?.role) return false;
    return rolePermissions[user.role].includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canManage = (module: 'clients' | 'spaces' | 'media' | 'students' | 'finance' | 'hr' | 'documents' | 'settings'): boolean => {
    return hasPermission(`manage_${module}` as Permission);
  };

  const canApproveExpenses = (): boolean => {
    return hasPermission('approve_expenses');
  };

  const canAccessDocumentCategory = (category: string): boolean => {
    if (!user?.role) return false;
    return documentCategoryPermissions[user.role].includes(category as DocumentCategory);
  };

  const getAccessibleDocumentCategories = (): DocumentCategory[] => {
    if (!user?.role) return [];
    return documentCategoryPermissions[user.role];
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canManage,
    canApproveExpenses,
    canAccessDocumentCategory,
    getAccessibleDocumentCategories,
    userRole: user?.role,
  };
}
