import { create } from 'zustand';

export type SupportSubTab = 'overview' | 'tickets' | 'help_center' | 'contact';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'high' | 'medium' | 'low';

export interface TicketMessage {
  id: string;
  sender: 'merchant' | 'support';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  lastUpdated: string;
  createdAt: string;
  orderRef?: string;
  messages: TicketMessage[];
}

export interface HelpTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
}

const initialTickets: SupportTicket[] = [
  {
    id: '#TKT1256',
    subject: 'Unable to sync inventory',
    category: 'Products & Inventory',
    status: 'in_progress',
    priority: 'high',
    lastUpdated: '18 May 2024',
    createdAt: '18 May 2024, 09:30 AM',
    orderRef: 'INV-SYNC-04',
    messages: [
      {
        id: 'msg-1',
        sender: 'merchant',
        senderName: 'Fashion Hub Admin',
        text: 'Hello team, the stock count for Men Cotton T-Shirt is not updating after recent offline billing.',
        timestamp: '18 May 2024, 09:30 AM',
      },
      {
        id: 'msg-2',
        sender: 'support',
        senderName: 'Merchant Desk Specialist',
        text: 'Hello! We are currently checking the barcode synchronization daemon. Could you please provide the barcode SKU or batch number?',
        timestamp: '18 May 2024, 10:15 AM',
      },
    ],
  },
  {
    id: '#TKT1255',
    subject: 'Payment not received',
    category: 'Billing & Payments',
    status: 'resolved',
    priority: 'medium',
    lastUpdated: '17 May 2024',
    createdAt: '16 May 2024, 02:15 PM',
    orderRef: 'ORD-9821',
    messages: [
      {
        id: 'msg-1',
        sender: 'merchant',
        senderName: 'Fashion Hub Admin',
        text: 'Order #ORD-9821 was marked delivered yesterday but payment is not reflected in my available wallet balance.',
        timestamp: '16 May 2024, 02:15 PM',
      },
      {
        id: 'msg-2',
        sender: 'support',
        senderName: 'Settlement Officer',
        text: 'The settlement cycle takes 24 hours post customer delivery confirmation. We verified the UPI gateway trace and credited ₹1,499 to your settlement bucket.',
        timestamp: '17 May 2024, 11:00 AM',
      },
    ],
  },
  {
    id: '#TKT1254',
    subject: 'How to add a new section?',
    category: 'Store Management',
    status: 'resolved',
    priority: 'low',
    lastUpdated: '16 May 2024',
    createdAt: '15 May 2024, 04:45 PM',
    messages: [
      {
        id: 'msg-1',
        sender: 'merchant',
        senderName: 'Fashion Hub Admin',
        text: 'I want to add a "Summer Special" carousel banner section on my mobile storefront homepage.',
        timestamp: '15 May 2024, 04:45 PM',
      },
      {
        id: 'msg-2',
        sender: 'support',
        senderName: 'Storefront Merchandising Specialist',
        text: 'You can easily configure this under Store Management > Manage Sections > "+ Add New Section".',
        timestamp: '16 May 2024, 09:10 AM',
      },
    ],
  },
];

const initialHelpTopics: HelpTopic[] = [
  {
    id: 'art-1',
    title: 'How do I create a new product?',
    category: 'Products & Inventory',
    summary: 'Step-by-step guide to add single SKUs or batch import with CSV barcodes.',
    content:
      'Go to Products / Catalog from the navigation menu. Click "+ Add Product" at the top right. Fill in SKU details, name, category, pricing, GST slab, and upload up to 5 product photos. Click Save to publish immediately to your store.',
    readTime: '3 min read',
  },
  {
    id: 'art-2',
    title: 'How do I manage inventory?',
    category: 'Products & Inventory',
    summary: 'Learn inventory threshold tracking, low-stock alerts and multi-location management.',
    content:
      'Navigate to Inventory to view real-time item counts, adjust stock levels per warehouse, and set minimum alert thresholds to receive automated alerts before running out.',
    readTime: '4 min read',
  },
  {
    id: 'art-3',
    title: 'How do I enable delivery?',
    category: 'Orders & Delivery',
    summary: 'Set delivery radius in kilometers, minimum order threshold, and delivery fees.',
    content:
      'Open Settings > Shipping & Returns. Turn on "Enable delivery for customer orders", select your service area, delivery partner, and estimated delivery window.',
    readTime: '2 min read',
  },
  {
    id: 'art-4',
    title: 'How do I generate an invoice?',
    category: 'Billing & Payments',
    summary: 'Generate GST-compliant tax invoices, quotation estimates, and thermal bill slips.',
    content:
      'Navigate to Billing & Invoicing > "+ Create New Bill". Use barcode scanning or quick SKU search to add items. The system auto-calculates CGST/SGST/IGST breakdown and generates printable PDF invoices.',
    readTime: '3 min read',
  },
  {
    id: 'art-5',
    title: 'How do I update my store details?',
    category: 'Store Management',
    summary: 'Update store profile, business timing, banner logo and address information.',
    content:
      'Go to Settings > Store Profile. Modify your store display name, description, address, city, and upload a square brand logo.',
    readTime: '3 min read',
  },
];

export type SupportViewMode = 'hub' | 'create_ticket' | 'faq_detail';

interface SupportState {
  activeView: SupportViewMode;
  activeTab: SupportSubTab;
  tickets: SupportTicket[];
  helpTopics: HelpTopic[];
  selectedTicketId: string | null;
  selectedHelpTopicId: string | null;
  isCreateTicketModalOpen: boolean;
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;

  // Actions
  setActiveView: (view: SupportViewMode) => void;
  setActiveTab: (tab: SupportSubTab) => void;
  setSelectedTicketId: (id: string | null) => void;
  setSelectedHelpTopicId: (id: string | null) => void;
  setIsCreateTicketModalOpen: (isOpen: boolean) => void;
  addTicket: (ticket: {
    subject: string;
    category: string;
    priority: TicketPriority;
    status?: TicketStatus;
    orderRef?: string;
    initialMessage: string;
  }) => void;
  addTicketMessage: (ticketId: string, text: string, sender?: 'merchant' | 'support') => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
}

export const useSupportStore = create<SupportState>((set) => ({
  activeView: 'hub',
  activeTab: 'overview',
  tickets: initialTickets,
  helpTopics: initialHelpTopics,
  selectedTicketId: null,
  selectedHelpTopicId: null,
  isCreateTicketModalOpen: false,
  searchQuery: '',
  statusFilter: 'all',
  priorityFilter: 'all',

  setActiveView: (view) => set({ activeView: view }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedTicketId: (id) => set({ selectedTicketId: id }),
  setSelectedHelpTopicId: (id) => set({ selectedHelpTopicId: id }),
  setIsCreateTicketModalOpen: (isOpen) => set({ isCreateTicketModalOpen: isOpen }),

  addTicket: ({ subject, category, priority, status, orderRef, initialMessage }) =>
    set((state) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const newId = `#TKT${1257 + state.tickets.length}`;

      const newTicket: SupportTicket = {
        id: newId,
        subject,
        category,
        priority,
        status: status || 'open',
        lastUpdated: dateStr,
        createdAt: `${dateStr}, ${timeStr}`,
        orderRef,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'merchant',
            senderName: 'Merchant Admin',
            text: initialMessage,
            timestamp: `${dateStr}, ${timeStr}`,
          },
        ],
      };

      return {
        tickets: [newTicket, ...state.tickets],
        isCreateTicketModalOpen: false,
        activeView: 'hub',
        selectedTicketId: newId,
      };
    }),

  addTicketMessage: (ticketId, text, sender = 'merchant') =>
    set((state) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      return {
        tickets: state.tickets.map((t) => {
          if (t.id !== ticketId) return t;
          const newMsg: TicketMessage = {
            id: `msg-${Date.now()}`,
            sender,
            senderName: sender === 'merchant' ? 'Merchant Admin' : 'Support Specialist',
            text,
            timestamp: `${dateStr}, ${timeStr}`,
          };
          return {
            ...t,
            lastUpdated: dateStr,
            status: sender === 'merchant' && t.status === 'resolved' ? 'in_progress' : t.status,
            messages: [...t.messages, newMsg],
          };
        }),
      };
    }),

  updateTicketStatus: (ticketId, status) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status, lastUpdated: 'Today' } : t
      ),
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
}));
