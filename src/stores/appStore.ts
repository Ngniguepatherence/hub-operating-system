import { create } from 'zustand';

// Types
export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  type: 'enterprise' | 'startup' | 'individual';
  status: 'active' | 'prospect' | 'inactive';
  revenue: number;
  lastContact: string;
  createdAt: string;
}

export interface Space {
  id: string;
  name: string;
  type: 'office' | 'conference' | 'coworking' | 'studio';
  capacity: number;
  pricePerHour: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  currentBooking?: {
    client: string;
    clientId: string;
    until: string;
    date: string;
  };
}

export interface Booking {
  id: string;
  spaceId: string;
  spaceName: string;
  clientId: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
}

export interface MediaProject {
  id: string;
  title: string;
  client: string;
  clientId: string;
  type: 'video' | 'audio' | 'podcast';
  status: 'briefing' | 'quote' | 'production' | 'review' | 'delivery' | 'completed';
  deadline: string;
  budget: number;
  progress: number;
  assignee: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  university: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  mentor: string;
}

export interface Transaction {
  id: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'approved';
  approvedBy?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'on_leave' | 'inactive';
  performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

export interface Department {
  id: string;
  name: string;
  headCount: number;
}

export interface Document {
  id: string;
  name: string;
  category: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadDate: string;
}

export interface Folder {
  id: string;
  name: string;
  category: string;
  count: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

// Initial data
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Jean-Pierre Kamdem',
    company: 'MTN Cameroon',
    email: 'jp.kamdem@mtn.cm',
    phone: '+237 699 123 456',
    type: 'enterprise',
    status: 'active',
    revenue: 45000,
    lastContact: '2 days ago',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Marie Nguefack',
    company: 'Startup Hub Africa',
    email: 'marie@startuphub.africa',
    phone: '+237 677 234 567',
    type: 'startup',
    status: 'active',
    revenue: 12000,
    lastContact: '1 week ago',
    createdAt: '2024-03-20',
  },
  {
    id: '3',
    name: 'Paul Mbarga',
    company: 'Cameroon Tech Corp',
    email: 'paul.m@camtech.cm',
    phone: '+237 655 345 678',
    type: 'enterprise',
    status: 'prospect',
    revenue: 0,
    lastContact: '3 days ago',
    createdAt: '2024-06-10',
  },
  {
    id: '4',
    name: 'Aisha Bello',
    company: 'Digital Creators CM',
    email: 'aisha@digitalcreators.cm',
    phone: '+237 698 456 789',
    type: 'startup',
    status: 'active',
    revenue: 8500,
    lastContact: 'Today',
    createdAt: '2024-02-28',
  },
  {
    id: '5',
    name: 'Emmanuel Fotso',
    company: 'Independent',
    email: 'e.fotso@gmail.com',
    phone: '+237 676 567 890',
    type: 'individual',
    status: 'inactive',
    revenue: 2000,
    lastContact: '1 month ago',
    createdAt: '2023-11-05',
  },
];

const initialSpaces: Space[] = [
  {
    id: '1',
    name: 'Executive Office A',
    type: 'office',
    capacity: 4,
    pricePerHour: 25,
    status: 'occupied',
    currentBooking: { client: 'MTN Cameroon', clientId: '1', until: '6:00 PM', date: '2024-12-25' },
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
    currentBooking: { client: 'Various', clientId: '', until: '8:00 PM', date: '2024-12-25' },
  },
  {
    id: '4',
    name: 'Recording Studio',
    type: 'studio',
    capacity: 6,
    pricePerHour: 75,
    status: 'reserved',
    currentBooking: { client: 'Digital Creators CM', clientId: '4', until: '4:00 PM', date: '2024-12-25' },
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

const initialProjects: MediaProject[] = [
  {
    id: '1',
    title: 'MTN Corporate Video 2024',
    client: 'MTN Cameroon',
    clientId: '1',
    type: 'video',
    status: 'production',
    deadline: 'Dec 30, 2024',
    budget: 15000,
    progress: 45,
    assignee: 'Video Team',
    createdAt: '2024-11-15',
  },
  {
    id: '2',
    title: 'Startup Hub Podcast Ep. 45',
    client: 'Startup Hub Africa',
    clientId: '2',
    type: 'podcast',
    status: 'review',
    deadline: 'Dec 26, 2024',
    budget: 800,
    progress: 80,
    assignee: 'Audio Team',
    createdAt: '2024-12-01',
  },
  {
    id: '3',
    title: 'Product Launch Video',
    client: 'Cameroon Tech Corp',
    clientId: '3',
    type: 'video',
    status: 'briefing',
    deadline: 'Jan 15, 2025',
    budget: 8500,
    progress: 10,
    assignee: 'Pending',
    createdAt: '2024-12-20',
  },
  {
    id: '4',
    title: 'Radio Ad Campaign',
    client: 'Digital Creators CM',
    clientId: '4',
    type: 'audio',
    status: 'delivery',
    deadline: 'Dec 24, 2024',
    budget: 2500,
    progress: 95,
    assignee: 'Audio Team',
    createdAt: '2024-12-10',
  },
  {
    id: '5',
    title: 'Documentary - Tech in Africa',
    client: 'WDH Internal',
    clientId: '',
    type: 'video',
    status: 'quote',
    deadline: 'Feb 28, 2025',
    budget: 25000,
    progress: 15,
    assignee: 'Video Team',
    createdAt: '2024-12-15',
  },
];

const initialStudents: Student[] = [
  { id: '1', name: 'Aline Kamga', email: 'aline.k@email.com', phone: '+237 699 111 111', program: 'Digital Marketing', university: 'University of Douala', startDate: 'Sep 2024', endDate: 'Mar 2025', status: 'active', progress: 65, mentor: 'Sarah Mbeki' },
  { id: '2', name: 'Paul Nkeng', email: 'paul.n@email.com', phone: '+237 699 222 222', program: 'Video Production', university: 'University of Yaoundé I', startDate: 'Oct 2024', endDate: 'Apr 2025', status: 'active', progress: 45, mentor: 'Jean Fotso' },
  { id: '3', name: 'Marie Essomba', email: 'marie.e@email.com', phone: '+237 699 333 333', program: 'UI/UX Design', university: 'ESSTIC', startDate: 'Nov 2024', endDate: 'May 2025', status: 'active', progress: 25, mentor: 'Eric Mboua' },
  { id: '4', name: 'David Tchoumi', email: 'david.t@email.com', phone: '+237 699 444 444', program: 'Audio Engineering', university: 'IST Douala', startDate: 'Aug 2024', endDate: 'Feb 2025', status: 'active', progress: 80, mentor: 'Michel Awono' },
  { id: '5', name: 'Grace Njoya', email: 'grace.n@email.com', phone: '+237 699 555 555', program: 'Content Creation', university: 'University of Buea', startDate: 'Jun 2024', endDate: 'Dec 2024', status: 'completed', progress: 100, mentor: 'Sarah Mbeki' },
];

const initialTransactions: Transaction[] = [
  { id: '1', description: 'MTN Corporate Video - Final Payment', type: 'income', category: 'Media', amount: 7500, date: 'Dec 23, 2024', status: 'completed' },
  { id: '2', description: 'Equipment Purchase - Camera Lens', type: 'expense', category: 'Equipment', amount: 2800, date: 'Dec 22, 2024', status: 'approved', approvedBy: 'CEO' },
  { id: '3', description: 'Conference Room Rental - Startup Hub', type: 'income', category: 'Spaces', amount: 450, date: 'Dec 22, 2024', status: 'completed' },
  { id: '4', description: 'Software Subscriptions - Adobe Suite', type: 'expense', category: 'Software', amount: 599, date: 'Dec 21, 2024', status: 'pending' },
  { id: '5', description: 'Podcast Production - Episode 45', type: 'income', category: 'Media', amount: 800, date: 'Dec 21, 2024', status: 'completed' },
];

const initialNotifications: Notification[] = [
  { id: '1', title: 'New Booking', message: 'MTN Cameroon booked Conference Room Alpha', type: 'info', read: false, createdAt: '2024-12-25T10:00:00Z' },
  { id: '2', title: 'Expense Pending', message: 'Adobe Suite subscription needs approval', type: 'warning', read: false, createdAt: '2024-12-25T09:30:00Z' },
  { id: '3', title: 'Project Completed', message: 'Radio Ad Campaign ready for delivery', type: 'success', read: true, createdAt: '2024-12-24T15:00:00Z' },
];

const initialEmployees: Employee[] = [
  { id: '1', name: 'Jean-Pierre Kamdem', email: 'jp@westdigitalhub.com', phone: '+237 699 111 111', position: 'Directeur', department: 'Direction', salary: 800000, joinDate: 'Jan 2022', status: 'active', performance: 'excellent' },
  { id: '2', name: 'Marie Nguefack', email: 'marie@westdigitalhub.com', phone: '+237 699 222 222', position: 'Manager', department: 'Production Média', salary: 500000, joinDate: 'Mar 2022', status: 'active', performance: 'good' },
  { id: '3', name: 'Paul Mbarga', email: 'paul@westdigitalhub.com', phone: '+237 699 333 333', position: 'Développeur', department: 'Tech & Dev', salary: 450000, joinDate: 'Jun 2023', status: 'active', performance: 'excellent' },
  { id: '4', name: 'Aisha Bello', email: 'aisha@westdigitalhub.com', phone: '+237 699 444 444', position: 'Designer', department: 'Design & Branding', salary: 400000, joinDate: 'Sep 2023', status: 'active', performance: 'good' },
  { id: '5', name: 'Emmanuel Fotso', email: 'emmanuel@westdigitalhub.com', phone: '+237 699 555 555', position: 'Ingénieur Audio', department: 'Production Média', salary: 380000, joinDate: 'Nov 2023', status: 'on_leave', performance: 'average' },
  { id: '6', name: 'Grace Njoya', email: 'grace@westdigitalhub.com', phone: '+237 699 666 666', position: 'Community Manager', department: 'Marketing Digital', salary: 350000, joinDate: 'Feb 2024', status: 'active', performance: 'good' },
];

const initialDepartments: Department[] = [
  { id: '1', name: 'Direction', headCount: 2 },
  { id: '2', name: 'Production Média', headCount: 5 },
  { id: '3', name: 'Tech & Dev', headCount: 4 },
  { id: '4', name: 'Design & Branding', headCount: 3 },
  { id: '5', name: 'Marketing Digital', headCount: 3 },
  { id: '6', name: 'Formation & Académie', headCount: 2 },
  { id: '7', name: 'Espaces & Coworking', headCount: 2 },
  { id: '8', name: 'Finance & Admin', headCount: 2 },
];

const initialDocuments: Document[] = [
  { id: '1', name: 'Contrat MTN Cameroon 2024', category: 'contracts', type: 'pdf', size: 245678, uploadedBy: 'Jean-Pierre Kamdem', uploadDate: '22 Dec 2024' },
  { id: '2', name: 'Facture Production Vidéo #2024-089', category: 'invoices', type: 'pdf', size: 128456, uploadedBy: 'Marie Nguefack', uploadDate: '21 Dec 2024' },
  { id: '3', name: 'Rapport Financier Q4 2024', category: 'reports', type: 'xlsx', size: 456789, uploadedBy: 'Emmanuel Fotso', uploadDate: '20 Dec 2024' },
  { id: '4', name: 'Template Brief Projet', category: 'templates', type: 'docx', size: 89012, uploadedBy: 'Paul Mbarga', uploadDate: '19 Dec 2024' },
  { id: '5', name: 'Charte Graphique WDH', category: 'policies', type: 'pdf', size: 1234567, uploadedBy: 'Aisha Bello', uploadDate: '18 Dec 2024' },
  { id: '6', name: 'Logo WDH Officiel', category: 'other', type: 'png', size: 567890, uploadedBy: 'Aisha Bello', uploadDate: '17 Dec 2024' },
];

const initialFolders: Folder[] = [
  { id: '1', name: 'Contrats', category: 'contracts', count: 12 },
  { id: '2', name: 'Factures', category: 'invoices', count: 45 },
  { id: '3', name: 'Rapports', category: 'reports', count: 8 },
  { id: '4', name: 'Templates', category: 'templates', count: 15 },
  { id: '5', name: 'Politiques', category: 'policies', count: 6 },
  { id: '6', name: 'Autres', category: 'other', count: 23 },
];

const initialTasks: Task[] = [
  { id: '1', title: 'Finaliser le montage vidéo MTN', description: 'Terminer le montage final et exporter en 4K', assigneeId: '2', assigneeName: 'Marie Nguefack', dueDate: '2024-12-30', priority: 'high', status: 'in_progress', createdAt: '2024-12-25' },
  { id: '2', title: 'Préparer le brief client', description: 'Rédiger le brief pour le nouveau projet Startup Hub', assigneeId: '3', assigneeName: 'Paul Mbarga', dueDate: '2024-12-28', priority: 'medium', status: 'pending', createdAt: '2024-12-25' },
  { id: '3', title: 'Review design landing page', description: 'Vérifier les maquettes de la landing page', assigneeId: '4', assigneeName: 'Aisha Bello', dueDate: '2024-12-27', priority: 'low', status: 'completed', createdAt: '2024-12-24' },
  { id: '4', title: 'Mixage audio podcast', description: 'Mixer l\'épisode 45 du podcast', assigneeId: '5', assigneeName: 'Emmanuel Fotso', dueDate: '2024-12-26', priority: 'high', status: 'pending', createdAt: '2024-12-23' },
  { id: '5', title: 'Mettre à jour les réseaux sociaux', description: 'Publier les stories et posts de la semaine', assigneeId: '6', assigneeName: 'Grace Njoya', dueDate: '2024-12-30', priority: 'medium', status: 'in_progress', createdAt: '2024-12-25' },
];

// Store interface
interface AppState {
  // Data
  clients: Client[];
  spaces: Space[];
  bookings: Booking[];
  projects: MediaProject[];
  students: Student[];
  transactions: Transaction[];
  notifications: Notification[];
  employees: Employee[];
  departments: Department[];
  documents: Document[];
  folders: Folder[];
  tasks: Task[];

  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'lastContact'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Space actions
  updateSpace: (id: string, updates: Partial<Space>) => void;

  // Booking actions
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;

  // Project actions
  addProject: (project: Omit<MediaProject, 'id' | 'createdAt' | 'progress'>) => void;
  updateProject: (id: string, updates: Partial<MediaProject>) => void;
  advanceProjectStatus: (id: string) => void;
  deleteProject: (id: string) => void;

  // Student actions
  addStudent: (student: Omit<Student, 'id' | 'progress'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  approveTransaction: (id: string, approvedBy: string) => void;
  deleteTransaction: (id: string) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;

  // Employee actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Document actions
  addDocument: (document: Omit<Document, 'id'>) => void;
  deleteDocument: (id: string) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Create store
export const useAppStore = create<AppState>((set, get) => ({
  clients: initialClients,
  spaces: initialSpaces,
  bookings: [],
  projects: initialProjects,
  students: initialStudents,
  transactions: initialTransactions,
  notifications: initialNotifications,
  employees: initialEmployees,
  departments: initialDepartments,
  documents: initialDocuments,
  folders: initialFolders,
  tasks: initialTasks,

  // Client actions
  addClient: (client) => {
    const newClient: Client = {
      ...client,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: 'Just now',
    };
    set((state) => ({ clients: [...state.clients, newClient] }));
    get().addNotification({
      title: 'New Client Added',
      message: `${newClient.name} from ${newClient.company} has been added`,
      type: 'success',
    });
  },

  updateClient: (id, updates) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === id ? { ...c, ...updates, lastContact: 'Just now' } : c
      ),
    }));
  },

  deleteClient: (id) => {
    const client = get().clients.find((c) => c.id === id);
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    }));
    if (client) {
      get().addNotification({
        title: 'Client Removed',
        message: `${client.name} has been removed from CRM`,
        type: 'info',
      });
    }
  },

  // Space actions
  updateSpace: (id, updates) => {
    set((state) => ({
      spaces: state.spaces.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  // Booking actions
  addBooking: (booking) => {
    const newBooking: Booking = {
      ...booking,
      id: generateId(),
    };
    set((state) => ({ bookings: [...state.bookings, newBooking] }));
    
    // Update space status
    get().updateSpace(booking.spaceId, {
      status: 'reserved',
      currentBooking: {
        client: booking.clientName,
        clientId: booking.clientId,
        until: booking.endTime,
        date: booking.date,
      },
    });
    
    get().addNotification({
      title: 'New Booking',
      message: `${booking.clientName} booked ${booking.spaceName}`,
      type: 'success',
    });
  },

  updateBooking: (id, updates) => {
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  },

  cancelBooking: (id) => {
    const booking = get().bookings.find((b) => b.id === id);
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: 'cancelled' as const } : b
      ),
    }));
    if (booking) {
      get().updateSpace(booking.spaceId, {
        status: 'available',
        currentBooking: undefined,
      });
    }
  },

  // Project actions
  addProject: (project) => {
    const newProject: MediaProject = {
      ...project,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      progress: 5,
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
    get().addNotification({
      title: 'New Media Project',
      message: `${newProject.title} has been created`,
      type: 'success',
    });
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  advanceProjectStatus: (id) => {
    const statusOrder: MediaProject['status'][] = [
      'briefing',
      'quote',
      'production',
      'review',
      'delivery',
      'completed',
    ];
    const project = get().projects.find((p) => p.id === id);
    if (project) {
      const currentIndex = statusOrder.indexOf(project.status);
      if (currentIndex < statusOrder.length - 1) {
        const newStatus = statusOrder[currentIndex + 1];
        const progressMap: Record<MediaProject['status'], number> = {
          briefing: 10,
          quote: 20,
          production: 50,
          review: 75,
          delivery: 90,
          completed: 100,
        };
        get().updateProject(id, {
          status: newStatus,
          progress: progressMap[newStatus],
        });
        get().addNotification({
          title: 'Project Advanced',
          message: `${project.title} moved to ${newStatus}`,
          type: 'info',
        });
      }
    }
  },

  deleteProject: (id) => {
    const project = get().projects.find((p) => p.id === id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
    if (project) {
      get().addNotification({
        title: 'Project Deleted',
        message: `${project.title} has been removed`,
        type: 'info',
      });
    }
  },

  // Student actions
  addStudent: (student) => {
    const newStudent: Student = {
      ...student,
      id: generateId(),
      progress: 0,
    };
    set((state) => ({ students: [...state.students, newStudent] }));
    get().addNotification({
      title: 'New Student Enrolled',
      message: `${newStudent.name} enrolled in ${newStudent.program}`,
      type: 'success',
    });
  },

  updateStudent: (id, updates) => {
    set((state) => ({
      students: state.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  deleteStudent: (id) => {
    const student = get().students.find((s) => s.id === id);
    set((state) => ({
      students: state.students.filter((s) => s.id !== id),
    }));
    if (student) {
      get().addNotification({
        title: 'Student Removed',
        message: `${student.name} has been removed from the program`,
        type: 'info',
      });
    }
  },

  // Transaction actions
  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };
    set((state) => ({ transactions: [newTransaction, ...state.transactions] }));
    get().addNotification({
      title: transaction.type === 'income' ? 'Income Recorded' : 'Expense Recorded',
      message: `${transaction.description}: $${transaction.amount}`,
      type: transaction.type === 'income' ? 'success' : 'warning',
    });
  },

  approveTransaction: (id, approvedBy) => {
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, status: 'approved' as const, approvedBy } : t
      ),
    }));
    const transaction = get().transactions.find((t) => t.id === id);
    if (transaction) {
      get().addNotification({
        title: 'Expense Approved',
        message: `${transaction.description} approved by ${approvedBy}`,
        type: 'success',
      });
    }
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },

  // Notification actions
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },

  // Employee actions
  addEmployee: (employee) => {
    const newEmployee: Employee = {
      ...employee,
      id: generateId(),
    };
    set((state) => ({ employees: [...state.employees, newEmployee] }));
    get().addNotification({
      title: 'Nouvel Employé',
      message: `${newEmployee.name} a rejoint l'équipe`,
      type: 'success',
    });
  },

  updateEmployee: (id, updates) => {
    set((state) => ({
      employees: state.employees.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  },

  deleteEmployee: (id) => {
    const employee = get().employees.find((e) => e.id === id);
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    }));
    if (employee) {
      get().addNotification({
        title: 'Employé Supprimé',
        message: `${employee.name} a été retiré de l'équipe`,
        type: 'info',
      });
    }
  },

  // Document actions
  addDocument: (document) => {
    const newDocument: Document = {
      ...document,
      id: generateId(),
    };
    set((state) => ({ documents: [...state.documents, newDocument] }));
    get().addNotification({
      title: 'Document Ajouté',
      message: `${newDocument.name} a été uploadé`,
      type: 'success',
    });
  },

  deleteDocument: (id) => {
    const document = get().documents.find((d) => d.id === id);
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    }));
    if (document) {
      get().addNotification({
        title: 'Document Supprimé',
        message: `${document.name} a été supprimé`,
        type: 'info',
      });
    }
  },

  // Task actions
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    get().addNotification({
      title: 'Tâche Assignée',
      message: `${newTask.title} assignée à ${newTask.assigneeName}`,
      type: 'success',
    });
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
}));
