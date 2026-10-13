import React from 'react';
import { Shirt, ListFilter, LayoutGrid, Info, ArrowRight, Search } from 'lucide-react';
import { useCatalogStore } from '../../../stores/catalogStore.js';
import { WizardHelpSidebar } from './WizardHelpSidebar.js';

interface CategoryDefinition {
  subCategories: string[];
  productTypes: Record<string, string[]>;
}

const defaultCategoryData: CategoryDefinition = {
  subCategories: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Ethnic Wear'],
  productTypes: {
    'T-Shirts': ['Round Neck T-Shirt', 'Polo T-Shirt', 'Oversized T-Shirt', 'V-Neck T-Shirt'],
    'Shirts': ['Formal Shirt', 'Casual Shirt', 'Flannel Shirt', 'Linen Shirt'],
    'Jeans': ['Slim Fit Jeans', 'Relaxed Jeans', 'Skinny Jeans', 'Ripped Jeans'],
    'Trousers': ['Chinos', 'Formal Trousers', 'Cargo Pants'],
    'Ethnic Wear': ['Kurta Pajama', 'Nehru Jacket', 'Sherwani'],
  },
};

const categoryCatalogTree: Record<string, CategoryDefinition> = {
  Men: defaultCategoryData,
  Women: {
    subCategories: ['Sarees', 'Kurtis & Suits', 'Dresses', 'Western Tops', 'Jeans & Jeggings'],
    productTypes: {
      'Sarees': ['Silk Saree', 'Cotton Saree', 'Georgette Saree', 'Chiffon Saree'],
      'Kurtis & Suits': ['Straight Kurti', 'Anarkali Suit', 'Palazzo Set'],
      'Dresses': ['Maxi Dress', 'A-Line Dress', 'Bodycon Dress', 'Floral Sundress'],
      'Western Tops': ['Crop Top', 'Button-Down Shirt', 'Peplum Top'],
      'Jeans & Jeggings': ['High-Waist Jeans', 'Skinny Jeggings', 'Bootcut Jeans'],
    },
  },
  Kids: {
    subCategories: ['Boys Clothing', 'Girls Clothing', 'Baby Care', 'Footwear'],
    productTypes: {
      'Boys Clothing': ['Graphic T-Shirt', 'Shorts Set', 'Party Wear Suit'],
      'Girls Clothing': ['Frock Dress', 'Top & Skirt Set', 'Ethnic Lehenga'],
      'Baby Care': ['Romper Onesie', 'Cotton Bodysuit', 'Swaddle Blanket'],
      'Footwear': ['Light-up Sneakers', 'Soft Booties', 'Sandals'],
    },
  },
  Footwear: {
    subCategories: ['Sneakers', 'Formal Shoes', 'Sandals & Slides', 'Sports Shoes'],
    productTypes: {
      'Sneakers': ['Low-top Canvas', 'Chunky Sneakers', 'Slip-on Shoes'],
      'Formal Shoes': ['Oxford Shoes', 'Derby Shoes', 'Loafers'],
      'Sandals & Slides': ['Leather Sandals', 'Casual Slides', 'Flip-Flops'],
      'Sports Shoes': ['Running Shoes', 'Training Shoes', 'Football Cleats'],
    },
  },
  Electronics: {
    subCategories: ['Audio', 'Mobile Accessories', 'Wearables', 'Cables & Power'],
    productTypes: {
      'Audio': ['Wireless Earbuds', 'Over-ear Headphones', 'Bluetooth Speaker'],
      'Mobile Accessories': ['Shockproof Case', 'Tempered Glass', 'Phone Stand'],
      'Wearables': ['Fitness Tracker', 'Smartwatch with AMOLED', 'Sports Band'],
      'Cables & Power': ['Fast Charger Adapter', 'Type-C Braided Cable', 'Power Bank 20000mAh'],
    },
  },
  'Home & Living': {
    subCategories: ['Bedding', 'Home Decor', 'Kitchen & Dining', 'Bath & Towels'],
    productTypes: {
      'Bedding': ['Bedsheet Set (Double)', 'Microfiber Pillows', 'Comforter Quilt'],
      'Home Decor': ['Wall Clock', 'Scented Candle', 'Indoor Planter Ceramic'],
      'Kitchen & Dining': ['Insulated Water Bottle', 'Stainless Steel Cookware', 'Coffee Mug Set'],
      'Bath & Towels': ['Cotton Bath Towel', 'Hand Towels Set', 'Anti-skid Bath Mat'],
    },
  },
  Accessories: {
    subCategories: ['Bags & Backpacks', 'Watches', 'Sunglasses', 'Belts & Wallets'],
    productTypes: {
      'Bags & Backpacks': ['Laptop Backpack', 'Travel Duffel', 'Crossbody Sling'],
      'Watches': ['Chronograph Watch', 'Minimalist Leather Watch', 'Digital Sport Watch'],
      'Sunglasses': ['Aviator Sunglasses', 'Wayfarer Shades', 'Polarized Sport'],
      'Belts & Wallets': ['Genuine Leather Belt', 'Bi-fold RFID Wallet', 'Card Holder'],
    },
  },
};

export const AddProductStep1: React.FC = () => {
  const { draftProduct, updateDraftProduct, setWizardStep } = useCatalogStore();

  const category = draftProduct.category || 'Men';
  const currentCategoryData = categoryCatalogTree[category] || defaultCategoryData;
  const subCategory = draftProduct.subCategory || currentCategoryData.subCategories[0] || 'T-Shirts';
  const availableProductTypes =
    (subCategory && currentCategoryData.productTypes[subCategory]) ||
    currentCategoryData.productTypes[currentCategoryData.subCategories[0] || ''] ||
    ['Standard'];
  const productType = draftProduct.productType || availableProductTypes[0] || 'Standard';
  const productIdentification = draftProduct.productIdentification || 'new';
  const brand = draftProduct.brand || 'Generic';
  const hsnCode = draftProduct.hsnCode || '61091000';

  const handleCategoryChange = (newCat: string) => {
    const nextCatData = categoryCatalogTree[newCat] || defaultCategoryData;
    const nextSub = nextCatData.subCategories[0] || 'T-Shirts';
    const nextTypes = nextCatData.productTypes[nextSub] || ['Standard'];
    updateDraftProduct({
      category: newCat,
      subCategory: nextSub,
      productType: nextTypes[0] || 'Standard',
    });
  };

  const handleSubCategoryChange = (newSub: string) => {
    const nextTypes = currentCategoryData.productTypes[newSub] || ['Standard'];
    updateDraftProduct({
      subCategory: newSub,
      productType: nextTypes[0] || 'Standard',
    });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setWizardStep(2);
  };

  return (
    <form onSubmit={handleContinue} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Main Form Cards */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card 1: Category, Sub-category & Product Type */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Category, Sub-category &amp; Product Type
              </h3>
            </div>
            <p className="text-xs text-slate-500 ml-8 mb-4">
              Choose the right category, sub-category and product type to get relevant attributes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    {Object.keys(categoryCatalogTree).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sub-category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sub-category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ListFilter className="w-4 h-4" />
                  </div>
                  <select
                    value={subCategory}
                    onChange={(e) => handleSubCategoryChange(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    {currentCategoryData.subCategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Product Type <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <select
                    value={productType}
                    onChange={(e) => updateDraftProduct({ productType: e.target.value })}
                    className="w-full pl-9 pr-8 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    {availableProductTypes.map((pt: string) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Product Identification */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Product Identification</h3>
            </div>
            <p className="text-xs text-slate-500 ml-8 mb-4">
              Tell us whether you want to add a new product or list an existing product from the
              master catalog.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Radio Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Add Product As <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="productIdentification"
                      checked={productIdentification === 'new'}
                      onChange={() => updateDraftProduct({ productIdentification: 'new' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">Add New Product</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="productIdentification"
                      checked={productIdentification === 'existing'}
                      onChange={() => updateDraftProduct({ productIdentification: 'existing' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Add Existing Product
                    </span>
                  </label>
                </div>
              </div>

              {/* Search Existing Product */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Search Existing Product
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={productIdentification === 'new'}
                    placeholder="Search by product name, SKU, barcode..."
                    value={draftProduct.existingSearchTerm || ''}
                    onChange={(e) => updateDraftProduct({ existingSearchTerm: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <div className="mt-1.5 text-[11px] text-slate-500">
                  Can&apos;t find the product?{' '}
                  <button
                    type="button"
                    onClick={() => updateDraftProduct({ productIdentification: 'new' })}
                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Add as new product
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Basic Product Setup */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Basic Product Setup</h3>
            </div>
            <p className="text-xs text-slate-500 ml-8 mb-4">
              Add basic details about your product.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Brand */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Brand / Manufacturer <span className="text-rose-500">*</span>
                </label>
                <select
                  value={brand}
                  onChange={(e) => updateDraftProduct({ brand: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="PUMA">PUMA</option>
                  <option value="Roadster">Roadster</option>
                  <option value="Nike">Nike</option>
                  <option value="Levis">Levis</option>
                  <option value="HRX">HRX</option>
                  <option value="Zara">Zara</option>
                  <option value="H&M">H&amp;M</option>
                </select>
              </div>

              {/* HSN Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  HSN Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) => updateDraftProduct({ hsnCode: e.target.value })}
                  placeholder="e.g. 61091000"
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  required
                />
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-blue-600">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Enter the correct HSN code to ensure smooth compliance and tax calculation.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Need Help Guidance */}
        <div className="lg:col-span-4">
          <WizardHelpSidebar step={1} />
        </div>
      </div>

      {/* Sticky Bottom Navigation Footer */}
      <div className="sticky bottom-0 z-20 -mx-4 -mb-4 px-6 py-3.5 bg-white/95 backdrop-blur-sm border-t border-slate-200/80 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Step 1 of 3</span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-bold text-slate-800">Category &amp; Product Setup</span>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <span>Continue to Step 2</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
