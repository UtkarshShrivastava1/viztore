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
    category: 'Inventory',
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
    category: 'Payments & Payouts',
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
      {
        id: 'msg-3',
        sender: 'merchant',
        senderName: 'Fashion Hub Admin',
        text: 'Confirmed, the funds are now visible. Thank you!',
        timestamp: '17 May 2024, 11:30 AM',
      },
    ],
  },
  {
    id: '#TKT1254',
    subject: 'How to add a new section?',
    category: 'Store Settings',
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
        text: 'You can easily configure this under Store Management > Store Sections > "+ Add New Section". Choose the Product Carousel layout and assign your Summer items.',
        timestamp: '16 May 2024, 09:10 AM',
      },
    ],
  },
  {
    id: '#TKT1253',
    subject: 'Invoice download issue',
    category: 'Invoicing & Tax',
    status: 'open',
    priority: 'high',
    lastUpdated: '15 May 2024',
    createdAt: '15 May 2024, 01:20 PM',
    orderRef: 'INV-2024-0089',
    messages: [
      {
        id: 'msg-1',
        sender: 'merchant',
        senderName: 'Fashion Hub Admin',
        text: 'When clicking "Download PDF" for GST Tax Invoice INV-2024-0089, the PDF generates a blank page on mobile browser.',
        timestamp: '15 May 2024, 01:20 PM',
      },
    ],
  },
  {
    id: '#TKT1252',
    subject: 'Product image not uploading',
    category: 'Product Catalog',
    status: 'resolved',
    priority: 'medium',
    lastUpdated: '14 May 2024',
    createdAt: '13 May 2024, 11:00 AM',
    messages: [
      {
        id: 'msg-1',
        sender: 'merchant',
        senderName: 'Fashion Hub Admin',
        text: 'High-res JPG images above 3MB fail to compress on bulk catalog upload.',
        timestamp: '13 May 2024, 11:00 AM',
      },
      {
        id: 'msg-2',
        sender: 'support',
        senderName: 'Platform Technical Support',
        text: 'Our server client-side compressor has been updated to support images up to 5MB automatically with WebP transcoding.',
        timestamp: '14 May 2024, 10:20 AM',
      },
    ],
  },
];

const initialHelpTopics: HelpTopic[] = [
  {
    id: 'art-1',
    title: 'How to add a new product?',
    category: 'Product Catalog',
    summary: 'Step-by-step guide to add single SKUs or batch import with CSV barcodes.',
    content:
      'Go to Products / Catalog from the navigation menu. Click "+ Add Product" at the top right. Fill in SKU details, name, category, pricing, GST slab, and upload up to 5 product photos. Click Save to publish immediately to your store.',
    readTime: '3 min read',
  },
  {
    id: 'art-2',
    title: 'How to manage orders?',
    category: 'Order Management',
    summary: 'Learn order workflow states: New, Confirmed, Packed, Shipped, and Delivered.',
    content:
      'Incoming orders appear in your Orders dashboard with audio alerts. Confirm orders within 15 minutes, print thermal packing slips, hand over packages to logistics partners, and verify delivery OTPs upon handover.',
    readTime: '4 min read',
  },
  {
    id: 'art-3',
    title: 'How to configure delivery settings?',
    category: 'Store Operations',
    summary: 'Set delivery radius in kilometers, minimum order threshold, and delivery fees.',
    content:
      'Open Settings > Operational Store Settings. Configure your store delivery radius (e.g. 5.5 km), express vs standard time windows, free delivery threshold (e.g. above ₹499), and enable store pickup if applicable.',
    readTime: '2 min read',
  },
  {
    id: 'art-4',
    title: 'How to receive payments?',
    category: 'Payouts & Banking',
    summary: 'Bank account verification, automated Tuesday settlements, and instant withdrawals.',
    content:
      'All merchant sales collected via UPI, Credit Card, and Cash on Delivery are credited to your merchant wallet. Weekly automatic settlements transfer funds to your verified IFSC bank account every Tuesday morning without transaction fees.',
    readTime: '5 min read',
  },
  {
    id: 'art-5',
    title: 'How to generate invoices?',
    category: 'Billing & Invoicing',
    summary: 'Generate GST-compliant tax invoices, quotation estimates, and thermal bill slips.',
    content:
      'Navigate to Billing & Invoicing > "+ Create New Bill". Use barcode scanning or quick SKU search to add items. The system auto-calculates CGST/SGST/IGST breakdown and generates printable PDF invoices with your business GSTIN and FSSAI license.',
    readTime: '3 min read',
  },
  {
    id: 'art-6',
    title: 'How to handle customer returns?',
    category: 'Returns & Refunds',
    summary: 'Process return requests, verify product condition, and initiate refund credits.',
    content:
      'Customers can request returns within 7 days. Review the customer photographic reason in Returns & Refunds. Upon accepting the package at your doorstep, verify item tag integrity and click "Approve Refund" to release wallet credit.',
    readTime: '4 min read',
  },
];

interface SupportState {
  activeTab: SupportSubTab;
  tickets: SupportTicket[];
  helpTopics: HelpTopic[];
  selectedTicketId: string | null;
  isCreateTicketModalOpen: boolean;
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;

  // Actions
  setActiveTab: (tab: SupportSubTab) => void;
  setSelectedTicketId: (id: string | null) => void;
  setIsCreateTicketModalOpen: (isOpen: boolean) => void;
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'lastUpdated' | 'messages'> & { initialMessage: string }) => void;
  addTicketMessage: (ticketId: string, text: string, sender?: 'merchant' | 'support') => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
}

export const useSupportStore = create<SupportState>((set) => ({
  activeTab: 'overview',
  tickets: initialTickets,
  helpTopics: initialHelpTopics,
  selectedTicketId: null,
  isCreateTicketModalOpen: false,
  searchQuery: '',
  statusFilter: 'all',
  priorityFilter: 'all',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedTicketId: (id) => set({ selectedTicketId: id }),
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
        activeTab: 'tickets',
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
