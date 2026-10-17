import { branding } from '../lib/branding.js';

export interface GuideArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  summary: string;
  whatYouLearn: string[];
  steps: {
    number: number;
    title: string;
    description: string;
    details?: string[];
  }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  summary: string;
  content: string[];
  featured?: boolean;
}

export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  iconName: string;
  articleCount: number;
}

export const MARKETING_DATA = {
  // 9 Retail Categories from 1.0.png
  retailCategories: [
    { name: 'Fashion & Apparel', icon: 'Shirt' },
    { name: 'Footwear', icon: 'Footprints' },
    { name: 'Electronics', icon: 'Headphones' },
    { name: 'Jewellery', icon: 'Gem' },
    { name: 'Beauty & Personal Care', icon: 'Sparkles' },
    { name: 'Home & Living', icon: 'Armchair' },
    { name: 'Gifts', icon: 'Gift' },
    { name: 'Sports', icon: 'Trophy' },
    { name: 'General Retail', icon: 'ShoppingBag' },
  ],

  // Value Pills for Hero Sections
  heroValuePills: [
    {
      title: 'No marketplace',
      subtitle: 'commission on product sales',
      icon: 'Award',
      badgeColor: 'bg-[#e6f9f0] text-[#10b981]',
    },
    {
      title: 'Get Discovered Locally',
      subtitle: 'by nearby customers',
      icon: 'MapPin',
      badgeColor: 'bg-[#e8f1ff] text-[#0052ff]',
    },
    {
      title: 'Simple Seller Onboarding',
      subtitle: 'Get started in a few steps',
      icon: 'Zap',
      badgeColor: 'bg-[#fff4e5] text-[#f59e0b]',
    },
    {
      title: 'Local Delivery Options',
      subtitle: 'Pickup or local delivery',
      icon: 'Truck',
      badgeColor: 'bg-[#e8f1ff] text-[#0052ff]',
    },
  ],

  // 6 Pricing FAQs from 3.0.png
  pricingFaqs: [
    {
      question: 'Is there any monthly plan?',
      answer:
        'No, we currently offer simple and transparent annual plans of ₹12,000 and ₹16,000. Annual plans give local shopkeepers complete predictability without fluctuating monthly overheads or commission cuts.',
    },
    {
      question: 'What are the delivery charges in the ₹16,000 plan?',
      answer:
        'There are zero merchant delivery charges for any order value under the Premium Plan (₹16,000/yr). You pay ₹0 per order for delivery fulfillment.',
    },
    {
      question: 'How do delivery charges work in the ₹12,000 plan?',
      answer:
        'For customer orders below ₹850, a nominal delivery charge of ₹30 per order applies. For orders of ₹850 and above, the delivery charge is ₹50 per order.',
    },
    {
      question: 'Is there any commission on product sales?',
      answer:
        'No, we do not take any percentage commission on your product sales. You keep 100% of your retail margin and earnings.',
    },
    {
      question: 'Are there any hidden charges?',
      answer:
        'No, there are zero hidden fees, onboarding setup charges, or monthly software maintenance deductions. Everything is included transparently in your chosen plan.',
    },
    {
      question: 'Can I upgrade or get a refund?',
      answer:
        'Yes, you can upgrade from Standard to Premium at any time with prorated pricing. For refund queries within our grace period, our dedicated merchant support desk is here to assist.',
    },
  ],

  // Guides
  guides: [
    {
      slug: 'how-to-set-up-your-store',
      title: `How to Set Up Your Store on ${branding.appName}`,
      category: 'Getting Started',
      readTime: '8 min read',
      date: 'Oct 12, 2024',
      author: 'Retail Support Team',
      summary:
        'Learn how to create your store, add basic details and go live in a few simple steps. This guide will help you get started quickly and start reaching more customers.',
      whatYouLearn: [
        'Create your store account',
        'Add basic store details',
        'Upload logo and images',
        'Choose store category',
        'Set your delivery and contact details',
        'Go live and start selling',
      ],
      steps: [
        {
          number: 1,
          title: 'Create Your Seller Account',
          description: `Visit the ${branding.appName} website and click on Start Selling. Sign up using your mobile number or email and verify your account with OTP.`,
          details: [
            'Enter your 10-digit mobile number or active email address.',
            'Receive an instant 4-digit verification code.',
            'Set up a secure login PIN for quick access.',
          ],
        },
        {
          number: 2,
          title: 'Add Your Store Details',
          description:
            'After login, fill in your store name, category, short description and upload your store logo. These details will be visible to customers.',
          details: [
            'Pick your primary category (Fashion, Electronics, Footwear, etc.).',
            'Upload a square logo (512x512 px recommended) and banner.',
            'Provide a friendly store description highlighting your specialty.',
          ],
        },
        {
          number: 3,
          title: 'Add Address and Contact Information',
          description:
            'Add your store address, contact number and other details so that customers can easily find and reach your store.',
          details: [
            'Pin your exact physical store location on the map.',
            'Specify your operational business hours for customer discovery.',
            'Configure your delivery radius (e.g. 2 to 5 km).',
          ],
        },
        {
          number: 4,
          title: 'Review and Go Live',
          description:
            'Review your store details and click on Go Live. Your store will be visible to nearby customers after verification.',
          details: [
            'Verify your GSTIN and PAN details for digital billing.',
            'Submit your onboarding form for immediate activation.',
          ],
        },
      ],
    },
    {
      slug: 'how-to-add-and-manage-products',
      title: 'Add and Manage Products effectively',
      category: 'Product Management',
      readTime: '6 min read',
      date: 'Oct 14, 2024',
      author: 'Catalog Operations',
      summary:
        'Learn how to add product images, prices, categories, sizes and variants to build an attractive digital catalog.',
      whatYouLearn: [
        'Organizing product categories',
        'High quality photo upload recommendations',
        'Setting variants (sizes, colors)',
        'Managing stock counts and low inventory triggers',
      ],
      steps: [
        {
          number: 1,
          title: 'Navigate to Products Catalog',
          description: 'Open the Merchant Hub and select Products from the sidebar.',
        },
        {
          number: 2,
          title: 'Add Product Information & Barcode',
          description: 'Enter title, SKU, barcode, MRP, and selling price.',
        },
        {
          number: 3,
          title: 'Configure Variants & Inventory',
          description: 'Set available stock units and enable low-stock alert thresholds.',
        },
      ],
    },
    {
      slug: 'how-to-manage-orders-and-deliveries',
      title: 'Manage Orders and Deliveries',
      category: 'Orders & Delivery',
      readTime: '5 min read',
      date: 'Oct 18, 2024',
      author: 'Logistics Desk',
      summary:
        'Learn how to receive, process and manage pickup or delivery orders seamlessly.',
      whatYouLearn: [
        'Real-time order arrival sound alerts',
        'Accepting and preparing orders',
        'Handing over packages with 4-digit Delivery OTP',
        'Managing customer returns and exchanges',
      ],
      steps: [
        {
          number: 1,
          title: 'Receive Incoming Order Alert',
          description: 'Audio chime triggers with live toast notification on new customer order.',
        },
        {
          number: 2,
          title: 'Prepare Package',
          description: 'Pack items and click Mark Ready for Pickup or Out for Delivery.',
        },
        {
          number: 3,
          title: 'Verify Delivery OTP',
          description: 'Enter the customer 4-digit OTP to complete order settlement.',
        },
      ],
    },
    {
      slug: 'grow-your-store-with-local-marketing',
      title: 'Grow Your Store with Local Marketing',
      category: 'Marketing & Growth',
      readTime: '7 min read',
      date: 'Oct 22, 2024',
      author: 'Growth Team',
      summary:
        'Tips to get more visibility, attract nearby customers and increase repeat walk-in and delivery orders.',
      whatYouLearn: [
        'Creating store discount coupons',
        'Printing counter QR standees for walk-in shoppers',
        'Running featured banner campaigns',
        'WhatsApp broadcast promotions',
      ],
      steps: [
        {
          number: 1,
          title: 'Generate Store QR Code & Short Link',
          description: 'Download high-res printable standees from Store Management.',
        },
        {
          number: 2,
          title: 'Launch Seasonal Offers',
          description: 'Create percentage or flat ₹ discount coupons for local festivals.',
        },
      ],
    },
  ],

  // Blog Posts
  blogPosts: [
    {
      slug: 'how-to-create-your-seller-account',
      title: `How to Create Your ${branding.appName} Seller Account`,
      category: 'Getting Started',
      readTime: '5 min read',
      date: 'Oct 12, 2024',
      author: 'Aakash Verma',
      summary:
        'Step-by-step guide to register and set up your store, verify your credentials, and start selling.',
      content: [
        'Digital retail in India is undergoing a massive shift. Local shopkeepers with physical presence in neighborhoods are discovering that having an online catalog expands their customer reach significantly.',
        'Setting up your seller account takes less than five minutes. All you need is your phone number, business address, and basic catalog details.',
        'Once registered, your storefront appears in local searches for shoppers within a 2-4 km radius.',
      ],
      featured: true,
    },
    {
      slug: 'how-to-add-and-manage-products-blog',
      title: 'How to Add and Manage Products',
      category: 'Product Management',
      readTime: '6 min read',
      date: 'Oct 14, 2024',
      author: 'Sneha Patel',
      summary:
        'Learn how to add product images, prices, categories, sizes and variants to your store.',
      content: [
        'An organized product catalog is the foundation of high-converting storefronts. Clear photographs, accurate descriptions, and well-tagged sizes help local buyers make rapid purchase decisions.',
        'Use our built-in barcode scanner integration to upload hundreds of SKUs effortlessly.',
      ],
      featured: true,
    },
    {
      slug: 'how-to-manage-orders-and-deliveries-blog',
      title: 'How to Manage Orders and Deliveries',
      category: 'Orders & Delivery',
      readTime: '5 min read',
      date: 'Oct 16, 2024',
      author: 'Rohan Sharma',
      summary:
        'Learn how to receive, process and manage pickup or delivery orders efficiently.',
      content: [
        'Speed is critical in local commerce. When a customer nearby places an order, instant sound chimes notify your counter staff.',
        'Our 4-stage order pipeline (New -> Preparing -> Out for Delivery -> Completed) keeps both merchant and customer synchronized at every checkpoint.',
      ],
    },
    {
      slug: 'how-to-generate-bills-and-invoices',
      title: 'How to Generate Bills and Invoices',
      category: 'Billing & GST',
      readTime: '4 min read',
      date: 'Oct 18, 2024',
      author: 'Pooja Iyer',
      summary:
        'Create professional bills with GST and share with customers via WhatsApp or print receipts.',
      content: [
        'Whether ringing up walk-in counter sales or fulfilling online home deliveries, our unified billing engine calculates CGST and SGST accurately.',
        'Support for 80mm thermal receipt printers and standard A4 tax invoice printouts guarantees tax compliance.',
      ],
    },
    {
      slug: 'how-to-get-more-customers-to-your-store',
      title: 'How to Get More Customers to Your Store',
      category: 'Marketing & Growth',
      readTime: '5 min read',
      date: 'Oct 20, 2024',
      author: 'Vikram Sethi',
      summary:
        'Tips to improve visibility, use social media and attract more local customers.',
      content: [
        'Hyperlocal discovery places your shop directly on the digital map of residents living within walking distance.',
        'Combining in-store QR standees with exclusive introductory coupons creates a powerful omnichannel flywheel.',
      ],
    },
    {
      slug: 'how-a-local-clothing-store-grew',
      title: `How a Local Clothing Store Grew with ${branding.appName}`,
      category: 'Success Stories',
      readTime: '4 min read',
      date: 'Oct 22, 2024',
      author: 'Editorial Team',
      summary:
        'See how a boutique in Bhilai increased customer reach and simplified billing.',
      content: [
        'Trendy Fashion Hub in Civic Centre, Bhilai, transitioned from a traditional footfall-only boutique to a thriving omnichannel retail hub.',
        '"Before going live, rainy days meant almost zero walk-in customers. Now, nearby families order dupattas and kurtas directly for home delivery," shares owner Priya Sharma.',
      ],
    },
  ],

  // Video Tutorials
  videos: [
    {
      id: 'vid-1',
      title: `How to Create Your ${branding.appName} Seller Account`,
      duration: '3:12',
      category: 'Getting Started',
      description: 'Step-by-step guide to register and set up your store.',
    },
    {
      id: 'vid-2',
      title: 'Complete Store Setup & Branding',
      duration: '4:05',
      category: 'Store Setup',
      description: 'Add store details, logo, address and customize your store banners.',
    },
    {
      id: 'vid-3',
      title: 'How to Add Products with Variants',
      duration: '5:18',
      category: 'Product Management',
      description: 'Add product images, prices, categories, sizes and variants in minutes.',
    },
    {
      id: 'vid-4',
      title: 'Manage Inventory & Low-Stock Alerts',
      duration: '4:27',
      category: 'Inventory',
      description: 'Track stock, update quantities and configure low stock alert thresholds.',
    },
    {
      id: 'vid-5',
      title: 'How to Manage Orders & Delivery OTP',
      duration: '6:20',
      category: 'Orders & Delivery',
      description: 'Learn how to accept, process and fulfill orders on the live pipeline.',
    },
    {
      id: 'vid-6',
      title: 'Grow Your Store with Social Media & QR',
      duration: '5:45',
      category: 'Marketing & Growth',
      description: 'Tips to get more visibility and attract nearby customers with QR standees.',
    },
    {
      id: 'vid-7',
      title: 'Generate Bills and GST Invoices',
      duration: '4:10',
      category: 'Billing & Payments',
      description: 'Create professional bills with GST and print 80mm thermal receipts.',
    },
    {
      id: 'vid-8',
      title: 'View Reports and Revenue Analytics',
      duration: '3:50',
      category: 'Reports',
      description: 'Track sales, top products, and customer trends to grow your business.',
    },
  ],

  // Help Topics (5.4.png)
  helpTopics: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Set up your store, complete your profile and start selling.',
      iconName: 'Store',
      articleCount: 12,
    },
    {
      id: 'products',
      title: 'Product Management',
      description: 'Add products, manage inventory, categories, sizes and more.',
      iconName: 'Package',
      articleCount: 18,
    },
    {
      id: 'orders',
      title: 'Orders & Delivery',
      description: 'Receive, manage and fulfill customer orders with pickup or local delivery.',
      iconName: 'Truck',
      articleCount: 15,
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Track stock, update quantities and manage variants.',
      iconName: 'Layers',
      articleCount: 10,
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      description: 'GST, invoices, payouts and payment related information.',
      iconName: 'CreditCard',
      articleCount: 14,
    },
    {
      id: 'marketing',
      title: 'Marketing & Growth',
      description: 'Use local discovery, offers and promotions to get more customers.',
      iconName: 'TrendingUp',
      articleCount: 11,
    },
    {
      id: 'settings',
      title: 'Store Settings',
      description: 'Manage store details, themes, QR code, staff and other settings.',
      iconName: 'Settings',
      articleCount: 9,
    },
    {
      id: 'account',
      title: 'Account & Plans',
      description: 'Manage your account, subscription, billing and plan details.',
      iconName: 'User',
      articleCount: 8,
    },
  ],

  // Retailer Testimonials
  testimonials: [
    {
      name: 'Priya Sharma',
      storeName: 'Trendy Fashion Hub',
      city: 'Bhilai',
      quote: `${branding.appName} helped us reach more customers in our area. Orders have increased and its very easy to use.`,
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      storeName: 'Style Studio',
      city: 'Durg',
      quote:
        'We started getting online orders within days. The platform is simple and perfect for local stores.',
      rating: 5,
    },
    {
      name: 'Neha Jain',
      storeName: 'Modern Looks',
      city: 'Raipur',
      quote:
        'Our products are now visible to nearby customers. Pickup orders work really well for our business.',
      rating: 5,
    },
  ],
};
