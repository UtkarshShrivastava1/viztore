import { create } from 'zustand';

export type AssetCategory =
  | 'IT Equipment'
  | 'Office Equipment'
  | 'Furniture'
  | 'Electrical'
  | 'Safety Equipment'
  | 'Security';

export type AssetStatus = 'Active' | 'Under Maintenance' | 'Fully Depreciated' | 'Disposed';

export interface MaintenanceRecord {
  id: string;
  date: string;
  serviceType: string;
  cost: number;
  technician: string;
  notes: string;
  status: 'Scheduled' | 'Completed';
}

export interface Asset {
  id: string;
  name: string;
  code: string;
  category: AssetCategory;
  subCategory?: string;
  location: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  status: AssetStatus;
  assetType?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  description?: string;
  tags?: string;
  vendor?: string;
  invoiceNumber?: string;
  warrantyExpiryDate?: string;
  assignedTo?: string;
  department?: string;
  costCenter?: string;
  rackShelf?: string;
  room?: string;
  depreciationMethod?: string;
  usefulLifeYears?: number;
  depreciationRate?: number;
  residualValue?: number;
  calculateDepreciation?: boolean;
  notes?: string;
  maintenanceHistory: MaintenanceRecord[];
}

export interface AssetKPIs {
  totalAssets: number;
  totalAssetValue: number;
  depreciableAssets: number;
  depreciablePercent: number;
  fullyDepreciated: number;
  underMaintenance: number;
}

interface AssetState {
  assets: Asset[];
  kpis: AssetKPIs;
  viewMode: 'list' | 'add';

  // Filters
  searchQuery: string;
  categoryFilter: string;
  locationFilter: string;
  statusFilter: string;

  // Selected item / Drawer
  selectedAsset: Asset | null;
  isMaintenanceDrawerOpen: boolean;

  // Actions
  setViewMode: (mode: 'list' | 'add') => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (cat: string) => void;
  setLocationFilter: (loc: string) => void;
  setStatusFilter: (stat: string) => void;
  clearFilters: () => void;
  setSelectedAsset: (asset: Asset | null) => void;
  setIsMaintenanceDrawerOpen: (open: boolean) => void;

  addAsset: (assetData: Omit<Asset, 'id' | 'maintenanceHistory'>) => void;
  addMaintenanceLog: (assetId: string, record: Omit<MaintenanceRecord, 'id'>) => void;
  updateAssetStatus: (assetId: string, status: AssetStatus) => void;
}

const initialAssets: Asset[] = [
  {
    id: 'AST-2024-0001',
    name: 'Dell Inspiron Laptop',
    code: 'AST-2024-0001',
    category: 'IT Equipment',
    location: 'Head Office',
    purchaseDate: '15 Jan 2024',
    purchaseValue: 65000.0,
    currentValue: 52000.0,
    status: 'Active',
    brand: 'Dell',
    model: 'Inspiron 15 3520',
    serialNumber: 'DL-INSP-882194',
    assignedTo: 'Store Manager',
    department: 'Operations',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2024-0002',
    name: 'HP LaserJet Printer',
    code: 'AST-2024-0002',
    category: 'Office Equipment',
    location: 'Head Office',
    purchaseDate: '10 Dec 2023',
    purchaseValue: 18000.0,
    currentValue: 12600.0,
    status: 'Active',
    brand: 'HP',
    model: 'LaserJet Pro M404dn',
    serialNumber: 'HP-LJP-49102',
    assignedTo: 'Billing Desk',
    department: 'Sales',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2024-0003',
    name: 'Office Chair - Executive',
    code: 'AST-2024-0003',
    category: 'Furniture',
    location: 'Head Office',
    purchaseDate: '05 Nov 2023',
    purchaseValue: 8500.0,
    currentValue: 6375.0,
    status: 'Active',
    brand: 'Featherlite',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2023-0008',
    name: 'Voltas AC 1.5 Ton',
    code: 'AST-2023-0008',
    category: 'Electrical',
    location: 'Store - Indore',
    purchaseDate: '20 Feb 2023',
    purchaseValue: 38000.0,
    currentValue: 22800.0,
    status: 'Under Maintenance',
    brand: 'Voltas',
    model: 'Vectra Platina 1.5T',
    warrantyExpiryDate: '20 Feb 2028',
    maintenanceHistory: [
      {
        id: 'MNT-101',
        date: '22 Sep 2026',
        serviceType: 'Compressor Coil Overhaul & Gas Refill',
        cost: 3200,
        technician: 'Voltas Authorized Service',
        notes: 'Annual deep clean and gas charge',
        status: 'Scheduled',
      },
    ],
  },
  {
    id: 'AST-2023-0011',
    name: 'LG 24" Monitor',
    code: 'AST-2023-0011',
    category: 'IT Equipment',
    location: 'Store - Bhopal',
    purchaseDate: '12 Jan 2023',
    purchaseValue: 12500.0,
    currentValue: 7500.0,
    status: 'Active',
    brand: 'LG',
    model: '24MP400-B',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2022-0004',
    name: 'Reception Sofa Set',
    code: 'AST-2022-0004',
    category: 'Furniture',
    location: 'Head Office',
    purchaseDate: '18 Aug 2022',
    purchaseValue: 25000.0,
    currentValue: 0.0,
    status: 'Fully Depreciated',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2022-0012',
    name: 'Fire Extinguisher Kit',
    code: 'AST-2022-0012',
    category: 'Safety Equipment',
    location: 'Store - Indore',
    purchaseDate: '01 Jul 2022',
    purchaseValue: 4200.0,
    currentValue: 1050.0,
    status: 'Active',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2021-0006',
    name: 'CCTV Camera System',
    code: 'AST-2021-0006',
    category: 'Security',
    location: 'Store - Bhopal',
    purchaseDate: '15 Mar 2021',
    purchaseValue: 22000.0,
    currentValue: 0.0,
    status: 'Disposed',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2021-0007',
    name: 'Luminous Invertor 1KVA',
    code: 'AST-2021-0007',
    category: 'Electrical',
    location: 'Store - Indore',
    purchaseDate: '10 Mar 2021',
    purchaseValue: 11500.0,
    currentValue: 0.0,
    status: 'Fully Depreciated',
    brand: 'Luminous',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2021-0008',
    name: 'Portable Generator 2.5KVA',
    code: 'AST-2021-0008',
    category: 'Electrical',
    location: 'Warehouse',
    purchaseDate: '22 Feb 2021',
    purchaseValue: 28000.0,
    currentValue: 9800.0,
    status: 'Active',
    brand: 'Honda',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2024-0015',
    name: 'Samsung Galaxy A52',
    code: 'AST-2024-0015',
    category: 'IT Equipment',
    location: 'Head Office',
    purchaseDate: '02 Apr 2024',
    purchaseValue: 26999.0,
    currentValue: 22000.0,
    status: 'Active',
    brand: 'Samsung',
    maintenanceHistory: [],
  },
  {
    id: 'AST-2023-0014',
    name: 'Kent Water Purifier',
    code: 'AST-2023-0014',
    category: 'Electrical',
    location: 'Store - Bhopal',
    purchaseDate: '11 Mar 2023',
    purchaseValue: 15500.0,
    currentValue: 9300.0,
    status: 'Active',
    brand: 'Kent',
    maintenanceHistory: [],
  },
];

export const useAssetStore = create<AssetState>((set) => ({
  assets: initialAssets,
  kpis: {
    totalAssets: 48,
    totalAssetValue: 1248500.0,
    depreciableAssets: 32,
    depreciablePercent: 67,
    fullyDepreciated: 3,
    underMaintenance: 2,
  },
  viewMode: 'list',

  searchQuery: '',
  categoryFilter: 'All Categories',
  locationFilter: 'All Locations',
  statusFilter: 'All Statuses',

  selectedAsset: null,
  isMaintenanceDrawerOpen: false,

  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setLocationFilter: (locationFilter) => set({ locationFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  clearFilters: () =>
    set({
      searchQuery: '',
      categoryFilter: 'All Categories',
      locationFilter: 'All Locations',
      statusFilter: 'All Statuses',
    }),
  setSelectedAsset: (selectedAsset) => set({ selectedAsset }),
  setIsMaintenanceDrawerOpen: (isMaintenanceDrawerOpen) => set({ isMaintenanceDrawerOpen }),

  addAsset: (assetData) =>
    set((state) => {
      const nextIdNum = state.assets.length + 1;
      const code = assetData.code || `AST-2026-00${nextIdNum.toString().padStart(2, '0')}`;
      const newAsset: Asset = {
        id: code,
        ...assetData,
        code,
        maintenanceHistory: [],
      };

      return {
        assets: [newAsset, ...state.assets],
        viewMode: 'list',
        kpis: {
          ...state.kpis,
          totalAssets: state.kpis.totalAssets + 1,
          totalAssetValue: state.kpis.totalAssetValue + newAsset.currentValue,
        },
      };
    }),

  addMaintenanceLog: (assetId, record) =>
    set((state) => {
      const updated = state.assets.map((a) => {
        if (a.id === assetId) {
          const newRec: MaintenanceRecord = {
            id: `MNT-${Date.now().toString().slice(-4)}`,
            ...record,
          };
          return {
            ...a,
            status: record.status === 'Scheduled' ? ('Under Maintenance' as AssetStatus) : a.status,
            maintenanceHistory: [newRec, ...a.maintenanceHistory],
          };
        }
        return a;
      });
      return {
        assets: updated,
        kpis: {
          ...state.kpis,
          underMaintenance: updated.filter((a) => a.status === 'Under Maintenance').length,
        },
      };
    }),

  updateAssetStatus: (assetId, status) =>
    set((state) => {
      const updated = state.assets.map((a) => (a.id === assetId ? { ...a, status } : a));
      return {
        assets: updated,
        kpis: {
          ...state.kpis,
          underMaintenance: updated.filter((a) => a.status === 'Under Maintenance').length,
          fullyDepreciated: updated.filter((a) => a.status === 'Fully Depreciated').length,
        },
      };
    }),
}));
