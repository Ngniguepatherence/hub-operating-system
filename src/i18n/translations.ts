export type Language = 'fr' | 'en';

export const translations = {
  // Common
  common: {
    search: { fr: 'Rechercher...', en: 'Search...' },
    save: { fr: 'Enregistrer', en: 'Save' },
    cancel: { fr: 'Annuler', en: 'Cancel' },
    delete: { fr: 'Supprimer', en: 'Delete' },
    edit: { fr: 'Modifier', en: 'Edit' },
    add: { fr: 'Ajouter', en: 'Add' },
    view: { fr: 'Voir', en: 'View' },
    close: { fr: 'Fermer', en: 'Close' },
    confirm: { fr: 'Confirmer', en: 'Confirm' },
    loading: { fr: 'Chargement...', en: 'Loading...' },
    noData: { fr: 'Aucune donnée', en: 'No data' },
    actions: { fr: 'Actions', en: 'Actions' },
    status: { fr: 'Statut', en: 'Status' },
    date: { fr: 'Date', en: 'Date' },
    name: { fr: 'Nom', en: 'Name' },
    email: { fr: 'Email', en: 'Email' },
    phone: { fr: 'Téléphone', en: 'Phone' },
    all: { fr: 'Tous', en: 'All' },
    active: { fr: 'Actif', en: 'Active' },
    inactive: { fr: 'Inactif', en: 'Inactive' },
    pending: { fr: 'En attente', en: 'Pending' },
    completed: { fr: 'Terminé', en: 'Completed' },
    approved: { fr: 'Approuvé', en: 'Approved' },
    rejected: { fr: 'Rejeté', en: 'Rejected' },
    total: { fr: 'Total', en: 'Total' },
    download: { fr: 'Télécharger', en: 'Download' },
    upload: { fr: 'Téléverser', en: 'Upload' },
    filter: { fr: 'Filtrer', en: 'Filter' },
    export: { fr: 'Exporter', en: 'Export' },
    signOut: { fr: 'Déconnexion', en: 'Sign Out' },
  },

  // Auth
  auth: {
    signIn: { fr: 'Se connecter', en: 'Sign In' },
    welcomeBack: { fr: 'Bon retour', en: 'Welcome back' },
    signInAccess: { fr: 'Connectez-vous pour accéder à votre tableau de bord', en: 'Sign in to access your dashboard' },
    selectRole: { fr: 'Sélectionner un rôle', en: 'Select Role' },
    password: { fr: 'Mot de passe', en: 'Password' },
    invalidCredentials: { fr: 'Identifiants invalides. Veuillez réessayer.', en: 'Invalid credentials. Please try again.' },
    demoInfo: { fr: 'Démo : Entrez un email et mot de passe pour continuer', en: 'Demo: Enter any email and password to continue' },
  },

  // Roles
  roles: {
    ceo: { fr: 'PDG - Admin Stratégique', en: 'CEO - Strategic Admin' },
    coo: { fr: 'DG - Admin Opérationnel', en: 'COO - Operational Admin' },
    cto: { fr: 'DT - Admin Technique', en: 'CTO - Technical Admin' },
    media_manager: { fr: 'Responsable Média', en: 'Media Manager' },
    admin: { fr: 'Admin / Secrétariat', en: 'Admin / Secretariat' },
    chiefExecutive: { fr: 'Directeur Exécutif', en: 'Chief Executive' },
    chiefOperations: { fr: 'Directeur des Opérations', en: 'Chief Operations' },
    chiefTechnology: { fr: 'Directeur Technique', en: 'Chief Technology' },
    mediaManager: { fr: 'Responsable Média', en: 'Media Manager' },
    administration: { fr: 'Administration', en: 'Administration' },
  },

  // Navigation
  nav: {
    dashboard: { fr: 'Tableau de bord', en: 'Dashboard' },
    crm: { fr: 'CRM', en: 'CRM' },
    spaces: { fr: 'Espaces', en: 'Spaces' },
    mediaProduction: { fr: 'Production Média', en: 'Media Production' },
    audio: { fr: 'Audio', en: 'Audio' },
    video: { fr: 'Vidéo', en: 'Video' },
    podcasts: { fr: 'Podcasts', en: 'Podcasts' },
    studentPrograms: { fr: 'Programmes Étudiants', en: 'Student Programs' },
    finance: { fr: 'Finance', en: 'Finance' },
    hrTeam: { fr: 'RH & Équipe', en: 'HR & Team' },
    documents: { fr: 'Documents', en: 'Documents' },
    notifications: { fr: 'Notifications', en: 'Notifications' },
    settings: { fr: 'Paramètres', en: 'Settings' },
    operatingSystem: { fr: 'Système d\'Exploitation', en: 'Operating System' },
  },

  // Dashboard
  dashboard: {
    title: { fr: 'Tableau de Bord Stratégique', en: 'Strategic Dashboard' },
    totalRevenue: { fr: 'Revenu Total', en: 'Total Revenue' },
    activeClients: { fr: 'Clients Actifs', en: 'Active Clients' },
    spaceOccupancy: { fr: 'Occupation Espaces', en: 'Space Occupancy' },
    mediaProjects: { fr: 'Projets Média', en: 'Media Projects' },
    revenueOverview: { fr: 'Aperçu des Revenus', en: 'Revenue Overview' },
    recentActivity: { fr: 'Activité Récente', en: 'Recent Activity' },
    moduleOverview: { fr: 'Aperçu des Modules', en: 'Module Overview' },
    workflowStatus: { fr: 'État des Flux', en: 'Workflow Status' },
    roleSubtitles: {
      ceo: { fr: 'Vue stratégique de toutes les opérations', en: 'Strategic overview of all operations' },
      coo: { fr: 'Métriques opérationnelles et performance équipe', en: 'Operational metrics and team performance' },
      cto: { fr: 'Santé système et vue technique', en: 'System health and technical overview' },
      media_manager: { fr: 'État de la production média', en: 'Media production status' },
      admin: { fr: 'Aperçu des opérations quotidiennes', en: 'Daily operations overview' },
    },
  },

  // CRM
  crm: {
    title: { fr: 'Gestion de la Relation Client', en: 'Customer Relationship Management' },
    subtitle: { fr: 'Gérez vos clients et prospects', en: 'Manage your clients and prospects' },
    addClient: { fr: 'Ajouter un Client', en: 'Add Client' },
    clientName: { fr: 'Nom du client', en: 'Client Name' },
    company: { fr: 'Entreprise', en: 'Company' },
    type: { fr: 'Type', en: 'Type' },
    revenue: { fr: 'Revenu', en: 'Revenue' },
    lastContact: { fr: 'Dernier Contact', en: 'Last Contact' },
    enterprise: { fr: 'Entreprise', en: 'Enterprise' },
    startup: { fr: 'Startup', en: 'Startup' },
    individual: { fr: 'Particulier', en: 'Individual' },
    prospect: { fr: 'Prospect', en: 'Prospect' },
    deleteConfirm: { fr: 'Êtes-vous sûr de vouloir supprimer ce client ?', en: 'Are you sure you want to delete this client?' },
  },

  // Spaces
  spaces: {
    title: { fr: 'Gestion des Espaces', en: 'Space Management' },
    subtitle: { fr: 'Gérez les bureaux, salles de conférence et studios', en: 'Manage offices, conference rooms and studios' },
    newBooking: { fr: 'Nouvelle Réservation', en: 'New Booking' },
    capacity: { fr: 'Capacité', en: 'Capacity' },
    pricePerHour: { fr: 'Prix/Heure', en: 'Price/Hour' },
    available: { fr: 'Disponible', en: 'Available' },
    occupied: { fr: 'Occupé', en: 'Occupied' },
    reserved: { fr: 'Réservé', en: 'Reserved' },
    maintenance: { fr: 'Maintenance', en: 'Maintenance' },
    office: { fr: 'Bureau', en: 'Office' },
    conference: { fr: 'Salle de Conférence', en: 'Conference Room' },
    coworking: { fr: 'Coworking', en: 'Coworking' },
    studio: { fr: 'Studio', en: 'Studio' },
    persons: { fr: 'personnes', en: 'persons' },
    until: { fr: 'jusqu\'à', en: 'until' },
  },

  // Media
  media: {
    title: { fr: 'Production Média', en: 'Media Production' },
    subtitle: { fr: 'Gérez la production audio, vidéo et podcast', en: 'Manage audio, video and podcast production' },
    newProject: { fr: 'Nouveau Projet', en: 'New Project' },
    projectTitle: { fr: 'Titre du Projet', en: 'Project Title' },
    client: { fr: 'Client', en: 'Client' },
    deadline: { fr: 'Échéance', en: 'Deadline' },
    budget: { fr: 'Budget', en: 'Budget' },
    progress: { fr: 'Progression', en: 'Progress' },
    assignee: { fr: 'Assigné à', en: 'Assignee' },
    workflow: { fr: 'Flux de Travail', en: 'Workflow' },
    briefing: { fr: 'Brief', en: 'Briefing' },
    quote: { fr: 'Devis', en: 'Quote' },
    production: { fr: 'Production', en: 'Production' },
    review: { fr: 'Révision', en: 'Review' },
    delivery: { fr: 'Livraison', en: 'Delivery' },
    advanceStatus: { fr: 'Avancer le statut', en: 'Advance Status' },
  },

  // Students
  students: {
    title: { fr: 'Programmes Étudiants', en: 'Student Programs' },
    subtitle: { fr: 'Gérez les stagiaires et programmes de formation', en: 'Manage interns and training programs' },
    enrollStudent: { fr: 'Inscrire un Étudiant', en: 'Enroll Student' },
    program: { fr: 'Programme', en: 'Program' },
    university: { fr: 'Université', en: 'University' },
    startDate: { fr: 'Date de Début', en: 'Start Date' },
    endDate: { fr: 'Date de Fin', en: 'End Date' },
    mentor: { fr: 'Mentor', en: 'Mentor' },
    programOverview: { fr: 'Aperçu des Programmes', en: 'Program Overview' },
    activeStudents: { fr: 'Étudiants Actifs', en: 'Active Students' },
    graduate: { fr: 'Diplômer', en: 'Graduate' },
    activate: { fr: 'Activer', en: 'Activate' },
  },

  // Finance
  finance: {
    title: { fr: 'Gestion Financière', en: 'Financial Management' },
    subtitle: { fr: 'Revenus, dépenses et rapports financiers', en: 'Revenue, expenses and financial reports' },
    addIncome: { fr: 'Ajouter Revenu', en: 'Add Income' },
    addExpense: { fr: 'Ajouter Dépense', en: 'Add Expense' },
    income: { fr: 'Revenus', en: 'Income' },
    expenses: { fr: 'Dépenses', en: 'Expenses' },
    balance: { fr: 'Solde', en: 'Balance' },
    pendingApproval: { fr: 'En Attente d\'Approbation', en: 'Pending Approval' },
    approve: { fr: 'Approuver', en: 'Approve' },
    category: { fr: 'Catégorie', en: 'Category' },
    amount: { fr: 'Montant', en: 'Amount' },
    description: { fr: 'Description', en: 'Description' },
    financialOverview: { fr: 'Aperçu Financier', en: 'Financial Overview' },
    recentTransactions: { fr: 'Transactions Récentes', en: 'Recent Transactions' },
  },

  // HR & Team
  hr: {
    title: { fr: 'RH & Gestion d\'Équipe', en: 'HR & Team Management' },
    subtitle: { fr: 'Gérez les employés, départements et performances', en: 'Manage employees, departments and performance' },
    addEmployee: { fr: 'Ajouter Employé', en: 'Add Employee' },
    employees: { fr: 'Employés', en: 'Employees' },
    departments: { fr: 'Départements', en: 'Departments' },
    position: { fr: 'Poste', en: 'Position' },
    department: { fr: 'Département', en: 'Department' },
    joinDate: { fr: 'Date d\'Embauche', en: 'Join Date' },
    salary: { fr: 'Salaire', en: 'Salary' },
    performance: { fr: 'Performance', en: 'Performance' },
    onLeave: { fr: 'En Congé', en: 'On Leave' },
    teamOverview: { fr: 'Aperçu de l\'Équipe', en: 'Team Overview' },
    leaveRequests: { fr: 'Demandes de Congé', en: 'Leave Requests' },
    approveLeave: { fr: 'Approuver Congé', en: 'Approve Leave' },
    rejectLeave: { fr: 'Refuser Congé', en: 'Reject Leave' },
    excellent: { fr: 'Excellent', en: 'Excellent' },
    good: { fr: 'Bon', en: 'Good' },
    average: { fr: 'Moyen', en: 'Average' },
    needsImprovement: { fr: 'À Améliorer', en: 'Needs Improvement' },
  },

  // Documents
  documents: {
    title: { fr: 'Gestion Documentaire', en: 'Document Management' },
    subtitle: { fr: 'Stockez et organisez tous vos documents', en: 'Store and organize all your documents' },
    uploadDocument: { fr: 'Téléverser Document', en: 'Upload Document' },
    folders: { fr: 'Dossiers', en: 'Folders' },
    files: { fr: 'Fichiers', en: 'Files' },
    createFolder: { fr: 'Créer Dossier', en: 'Create Folder' },
    fileName: { fr: 'Nom du Fichier', en: 'File Name' },
    size: { fr: 'Taille', en: 'Size' },
    uploadedBy: { fr: 'Téléversé par', en: 'Uploaded By' },
    uploadDate: { fr: 'Date de Téléversement', en: 'Upload Date' },
    contracts: { fr: 'Contrats', en: 'Contracts' },
    invoices: { fr: 'Factures', en: 'Invoices' },
    reports: { fr: 'Rapports', en: 'Reports' },
    templates: { fr: 'Modèles', en: 'Templates' },
    policies: { fr: 'Politiques', en: 'Policies' },
    other: { fr: 'Autres', en: 'Other' },
  },

  // Settings
  settings: {
    title: { fr: 'Paramètres', en: 'Settings' },
    subtitle: { fr: 'Configurez les paramètres de la plateforme', en: 'Configure platform settings' },
    general: { fr: 'Général', en: 'General' },
    appearance: { fr: 'Apparence', en: 'Appearance' },
    notifications: { fr: 'Notifications', en: 'Notifications' },
    security: { fr: 'Sécurité', en: 'Security' },
    integrations: { fr: 'Intégrations', en: 'Integrations' },
    language: { fr: 'Langue', en: 'Language' },
    french: { fr: 'Français', en: 'French' },
    english: { fr: 'Anglais', en: 'English' },
    theme: { fr: 'Thème', en: 'Theme' },
    darkMode: { fr: 'Mode Sombre', en: 'Dark Mode' },
    lightMode: { fr: 'Mode Clair', en: 'Light Mode' },
    emailNotifications: { fr: 'Notifications Email', en: 'Email Notifications' },
    pushNotifications: { fr: 'Notifications Push', en: 'Push Notifications' },
    companyInfo: { fr: 'Informations Entreprise', en: 'Company Information' },
    companyName: { fr: 'Nom de l\'Entreprise', en: 'Company Name' },
    address: { fr: 'Adresse', en: 'Address' },
    timezone: { fr: 'Fuseau Horaire', en: 'Timezone' },
    currency: { fr: 'Devise', en: 'Currency' },
  },

  // Notifications
  notifications: {
    title: { fr: 'Centre de Notifications', en: 'Notification Center' },
    subtitle: { fr: 'Restez informé des dernières activités', en: 'Stay informed of latest activities' },
    markAllRead: { fr: 'Tout marquer comme lu', en: 'Mark all as read' },
    noNotifications: { fr: 'Aucune notification', en: 'No notifications' },
    newBooking: { fr: 'Nouvelle Réservation', en: 'New Booking' },
    expensePending: { fr: 'Dépense en Attente', en: 'Expense Pending' },
    projectCompleted: { fr: 'Projet Terminé', en: 'Project Completed' },
  },

  // West Digital Hub specific
  wdh: {
    tagline: { fr: 'Système d\'Exploitation', en: 'Operating System' },
    description: { 
      fr: 'La plateforme centralisée alimentant toutes les opérations, du CRM à la production média, conçue pour faire fonctionner West Digital Hub comme une machine.',
      en: 'The centralized platform powering all operations, from CRM to media production, designed to make West Digital Hub function like a machine.'
    },
    features: {
      crmClients: { fr: 'CRM & Clients', en: 'CRM & Clients' },
      spaceManagement: { fr: 'Gestion des Espaces', en: 'Space Management' },
      mediaProduction: { fr: 'Production Média', en: 'Media Production' },
      financeHr: { fr: 'Finance & RH', en: 'Finance & HR' },
    },
    copyright: { fr: '© 2024 West Digital Hub. Tous droits réservés.', en: '© 2024 West Digital Hub. All rights reserved.' },
  },
};

export function t(key: string, language: Language): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  if (value && typeof value === 'object' && language in value) {
    return value[language];
  }
  
  return key;
}
