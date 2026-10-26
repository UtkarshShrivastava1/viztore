import React, { useState } from 'react';
import {
  Search,
  Filter,
  Check,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ShoppingBag,
  Store,
  LayoutGrid,
  Percent,
  Image as ImageIcon,
  Tag,
  Phone,
  Mail,
  Info,
} from 'lucide-react';
import { AdType } from '../../stores/marketingStore.js';

interface SelectedProductType {
  id: string;
  name: string;
  sku: string;
  price: number;
  rating: number;
  reviews: number;
  sizes: string;
  color: string;
  category: string;
  subcategory: string;
  image: string;
  stock: number;
}

interface Step2TargetEntityProps {
  selectedType: AdType;
  selectedProduct: SelectedProductType;
  onSelectProduct: (product: SelectedProductType) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2TargetEntity: React.FC<Step2TargetEntityProps> = ({
  selectedType,
  selectedProduct,
  onSelectProduct,
  onNext,
  onBack,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Men');
  const [storeTagline, setStoreTagline] = useState('Trending Styles for Every You • Up to 40% OFF');
  const [contactNumber, setContactNumber] = useState('98765 43210');
  const [email, setEmail] = useState('support@fashionhub.com');
  const [offerType, setOfferType] = useState('Discount Offer');

  const catalogProducts: SelectedProductType[] = [
    {
      id: 'PRD-10245',
      name: 'Men Checked Shirt',
      sku: '#P54321',
      price: 699,
      rating: 4.5,
      reviews: 120,
      sizes: 'M, L, XL',
      color: 'Red',
      category: 'Men',
      subcategory: 'Top Wear',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80',
      stock: 18,
    },
    {
      id: 'PRD-10246',
      name: 'Men Solid Cotton Polo',
      sku: '#P54322',
      price: 799,
      rating: 4.6,
      reviews: 85,
      sizes: 'S, M, L, XXL',
      color: 'Black',
      category: 'Men',
      subcategory: 'Top Wear',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&auto=format&fit=crop&q=80',
      stock: 24,
    },
    {
      id: 'PRD-10247',
      name: 'Slim Fit Denim Jeans',
      sku: '#P54323',
      price: 1299,
      rating: 4.4,
      reviews: 154,
      sizes: '30, 32, 34, 36',
      color: 'Blue',
      category: 'Men',
      subcategory: 'Bottom Wear',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=400&auto=format&fit=crop&q=80',
      stock: 12,
    },
    {
      id: 'PRD-10248',
      name: 'Urban Casual Sneakers',
      sku: '#P54324',
      price: 1899,
      rating: 4.8,
      reviews: 210,
      sizes: '7, 8, 9, 10',
      color: 'White',
      category: 'Footwear',
      subcategory: 'Shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
      stock: 9,
    },
    {
      id: 'PRD-10249',
      name: 'Leather Formal Belt',
      sku: '#P54325',
      price: 499,
      rating: 4.3,
      reviews: 64,
      sizes: 'Free Size',
      color: 'Brown',
      category: 'Accessories',
      subcategory: 'Belts',
      image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&auto=format&fit=crop&q=80',
      stock: 35,
    },
  ];

  const filteredProducts = catalogProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          2. Choose Target Entity to Promote
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {selectedType === 'Sponsored Product'
            ? 'Select the specific inventory item you want to highlight across customer search and product feeds.'
            : selectedType === 'Sponsored Store'
            ? 'Set up your store spotlight details and headline.'
            : selectedType === 'Category Promotion'
            ? 'Select which department hierarchy to sponsor.'
            : selectedType === 'Banner Ad' || selectedType === 'Banner Advertisement'
            ? 'Upload banner creatives and share contact details for manual placement review.'
            : 'Select the promotional deal package.'}
        </p>
      </div>

      {/* Conditional Step 2 Body Based on Ad Type */}
      {selectedType === 'Sponsored Product' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Product Picker (8 Cols) (12.2a.png) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option>Men</option>
                  <option>Footwear</option>
                  <option>Accessories</option>
                  <option>All Categories</option>
                </select>
              </div>
            </div>

            {/* High Density Product Table (12.2a.png) */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-8">Select</th>
                    <th className="py-2.5 px-3">Product Details</th>
                    <th className="py-2.5 px-2.5">Category</th>
                    <th className="py-2.5 px-2.5">Price</th>
                    <th className="py-2.5 px-2.5 text-right">In Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isSelected = selectedProduct.id === p.id;
                    return (
                      <tr
                        key={p.id}
                        onClick={() => onSelectProduct(p)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => onSelectProduct(p)}
                            className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                                {p.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {p.sku} • {p.color} • {p.sizes}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2.5 text-slate-600 font-medium">
                          {p.category}
                        </td>
                        <td className="py-2.5 px-2.5 font-bold text-slate-900">
                          ₹{p.price.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-2.5 text-right font-semibold text-emerald-700">
                          {p.stock} units
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Selected Product Card Preview (4 Cols) (12.2a.png) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Selected Product</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                Targeted
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2.5">
              <div className="relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-40 object-cover rounded-lg border border-slate-200"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-2xs">
                  Sponsored
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedProduct.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-black text-slate-900">₹{selectedProduct.price}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({selectedProduct.sku})</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-1">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                    Sizes: {selectedProduct.sizes}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                    Stock: {selectedProduct.stock}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-[11px] text-blue-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Eligibility Confirmed</span>
              </div>
              <p className="text-[10px] text-blue-700 leading-relaxed">
                This item has high customer ratings and adequate stock to support sponsored campaign volume.
              </p>
            </div>
          </div>
        </div>
      ) : selectedType === 'Sponsored Store' ? (
        /* Store Spotlight Form (12.3a.png) */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs max-w-xl space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Store Name</label>
            <input
              type="text"
              defaultValue="Fashion Hub Store"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              readOnly
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Headline / Tagline</label>
            <input
              type="text"
              value={storeTagline}
              onChange={(e) => setStoreTagline(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      ) : selectedType === 'Banner Ad' || selectedType === 'Banner Advertisement' ? (
        /* Banner Advertisement Form (12.6a.png) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Banner Image *</label>
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-blue-50/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/60 transition-colors">
                <Upload className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-xs font-bold text-slate-800">
                  Drag &amp; drop banner image or click to browse
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Supported: JPG, PNG, WebP (Max 5MB)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Contact Number *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Recommended Dimensions</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block">Desktop Banner</span>
                <span className="text-[11px] text-slate-500">1920 × 600 px (Recommended)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block">Mobile Banner</span>
                <span className="text-[11px] text-slate-500">1080 × 1080 px (Square)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Category Promotion Form (12.4a.png) */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs max-w-xl space-y-3">
          <label className="text-xs font-bold text-slate-800 block">Target Category</label>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {['Men Fashion', 'Women Fashion', 'Kids Wear', 'Footwear', 'Accessories', 'Electronics'].map((cat) => (
              <div
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                  selectedCategory === cat ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
        >
          <span>Continue to Budget &amp; Bidding</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
