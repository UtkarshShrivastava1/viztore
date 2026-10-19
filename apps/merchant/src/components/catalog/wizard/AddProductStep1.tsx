import React from 'react';
import { Shirt, ListFilter, LayoutGrid, Info, ArrowRight, Search } from 'lucide-react';
import { useCatalogStore } from '../../../stores/catalogStore.js';
import { WizardHelpSidebar } from './WizardHelpSidebar.js';
import { CreatableCombobox } from '../../ui/CreatableCombobox.js';

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
  'Grocery & Staples': {
    subCategories: ['Atta & Flours', 'Rice & Grains', 'Dal & Pulses', 'Edible Oils & Ghee', 'Spices & Masalas', 'Dry Fruits & Nuts'],
    productTypes: {
      'Atta & Flours': ['Chakki Fresh Atta', 'Maida', 'Besan', 'Multi-grain Flour'],
      'Rice & Grains': ['Basmati Rice', 'Kolam Rice', 'Poha / Flattened Rice', 'Dalia'],
      'Dal & Pulses': ['Toor Dal', 'Moong Dal', 'Chana Dal', 'Urad Dal'],
      'Edible Oils & Ghee': ['Mustard Oil', 'Sunflower Oil', 'Cow Ghee', 'Olive Oil'],
      'Spices & Masalas': ['Turmeric Powder', 'Red Chilli Powder', 'Garam Masala', 'Whole Spices'],
      'Dry Fruits & Nuts': ['Almonds / Badam', 'Cashews / Kaju', 'Raisins / Kishmish', 'Walnuts'],
    },
  },
  'FMCG & Packaged Foods': {
    subCategories: ['Biscuits & Cookies', 'Snacks & Namkeen', 'Beverages & Tea', 'Chocolates & Sweets', 'Instant Noodles & Soups'],
    productTypes: {
      'Biscuits & Cookies': ['Glucose Biscuits', 'Cream Crackers', 'Digestive Cookies', 'Rusk'],
      'Snacks & Namkeen': ['Bhujia', 'Potato Chips', 'Roasted Makhanas', 'Mixture'],
      'Beverages & Tea': ['Premium CTC Tea', 'Green Tea Bags', 'Instant Coffee', 'Fruit Juices'],
      'Chocolates & Sweets': ['Milk Chocolate', 'Dark Chocolate Bar', 'Traditional Gulab Jamun Tin'],
      'Instant Noodles & Soups': ['Instant Noodles 4-Pack', 'Cup Noodles', 'Tomato Soup Mix'],
    },
  },
  'Beauty & Personal Care': {
    subCategories: ['Skin Care', 'Hair Care', 'Bath & Body', 'Oral Care', 'Fragrances & Deos'],
    productTypes: {
      'Skin Care': ['Face Wash', 'Moisturizing Cream', 'Sunscreen SPF 50', 'Face Serum'],
      'Hair Care': ['Anti-Dandruff Shampoo', 'Hair Conditioner', 'Coconut Hair Oil'],
      'Bath & Body': ['Bathing Bar Soap', 'Body Wash Gel', 'Body Lotion'],
      'Oral Care': ['Toothpaste 150g', 'Soft Toothbrush Pack', 'Mouthwash'],
      'Fragrances & Deos': ['Pocket Deodorant', 'Body Spray 150ml', 'Eau de Parfum'],
    },
  },
  'Pharmacy & Wellness': {
    subCategories: ['Ayurvedic Care', 'First Aid', 'Health Supplements', 'Baby Nutrition'],
    productTypes: {
      'Ayurvedic Care': ['Chyawanprash', 'Triphala Powder', 'Herbal Cough Syrup', 'Giloy Juice'],
      'First Aid': ['Antiseptic Liquid', 'Bandages / Strips', 'Pain Relief Gel', 'Cotton Roll'],
      'Health Supplements': ['Multivitamin Capsules', 'Protein Powder', 'Fish Oil Omega-3'],
      'Baby Nutrition': ['Infant Cereal', 'Gripe Water', 'Baby Gripe Water'],
    },
  },
  'Sports & Fitness': {
    subCategories: ['Fitness Equipment', 'Gym Wear', 'Yoga & Mats', 'Sports Gear'],
    productTypes: {
      'Fitness Equipment': ['Dumbbells Set', 'Resistance Bands', 'Hand Gripper'],
      'Gym Wear': ['Quick-Dry Gym T-Shirt', 'Compression Tights', 'Workout Shorts'],
      'Yoga & Mats': ['Anti-Slip Yoga Mat 6mm', 'Yoga Foam Roller', 'Yoga Block'],
      'Sports Gear': ['Cricket Bat', 'Badminton Racket', 'Football Size 5', 'Shuttlecocks'],
    },
  },
  'Automotive & Spares': {
    subCategories: ['Two-Wheeler Helmets', 'Two-Wheeler Spares', 'Car Accessories', 'Cleaning & Lubricants'],
    productTypes: {
      'Two-Wheeler Helmets': ['Full Face Helmet', 'Open Face Helmet', 'Riding Gloves'],
      'Two-Wheeler Spares': ['Brake Shoes', 'Spark Plug', 'Rearview Mirror Set', 'Indicator Light'],
      'Car Accessories': ['Mobile Dashboard Holder', 'Car Perfume Vent Clip', 'Seat Cushion'],
      'Cleaning & Lubricants': ['Engine Oil 4T 1L', 'Chain Lube Spray', 'Microfiber Cloth Pack'],
    },
  },
  'Stationery & Books': {
    subCategories: ['Notebooks & Registers', 'Pens & Writing', 'Art & Craft', 'Office Supplies'],
    productTypes: {
      'Notebooks & Registers': ['Single Line Notebook 172p', 'Spiral Journal A5', 'Register 240p'],
      'Pens & Writing': ['Ballpoint Pens Pack of 5', 'Gel Pens 0.5mm', 'Highlighters Set'],
      'Art & Craft': ['Acrylic Paints 12-Shades', 'Sketch Book A4', 'Oil Pastels'],
      'Office Supplies': ['Stapler No. 10', 'Correction Pen', 'Desk Organizer', 'Calculator'],
    },
  },
  'Bakery & Confectionery': {
    subCategories: ['Fresh Breads', 'Cakes & Pastries', 'Cookies & Toast', 'Artisan Chocolates'],
    productTypes: {
      'Fresh Breads': ['Whole Wheat Brown Bread', 'White Sandwich Bread', 'Pav / Buns Pack'],
      'Cakes & Pastries': ['Chocolate Truffle Pastry', 'Plum Cake', 'Red Velvet Slice'],
      'Cookies & Toast': ['Butter Rusk', 'Jeera Khari Puff', 'Almond Biscotti'],
      'Artisan Chocolates': ['Handcrafted Dark Truffles', 'Dry Fruit Chocolate Bar'],
    },
  },
  'General & Other': {
    subCategories: ['Daily Essentials', 'Hardware & Tools', 'Gifts & Toys', 'Pet Supplies'],
    productTypes: {
      'Daily Essentials': ['General Commodity', 'Packaged Goods', 'Utility Item'],
      'Hardware & Tools': ['Screwdriver Set', 'Measuring Tape 5m', 'Insulation Tape'],
      'Gifts & Toys': ['Gift Wrapping Paper', 'Action Figure', 'Board Game'],
      'Pet Supplies': ['Dog Food 1kg', 'Cat Treats', 'Pet Shampoo'],
    },
  },
};

const commonBrandOptions = [
  'Generic / Unbranded',
  'Local Artisan / In-House',
  'PUMA',
  'Nike',
  'Roadster',
  'Levis',
  'HRX',
  'Zara',
  'H&M',
  'Amul',
  'Tata Sampann',
  'Nestle',
  'Britannia',
  'Dabur',
  'Patanjali',
  'boAt',
  'Noise',
  'Samsung',
  'Milton',
  'Prestige',
];

export const AddProductStep1: React.FC = () => {
  const { draftProduct, updateDraftProduct, setWizardStep } = useCatalogStore();

  const category = draftProduct.category || 'Men';
  const currentCategoryData = categoryCatalogTree[category] || {
    subCategories: [draftProduct.subCategory || 'General'],
    productTypes: {
      [draftProduct.subCategory || 'General']: [draftProduct.productType || 'Standard'],
    },
  };
  const subCategory =
    draftProduct.subCategory || currentCategoryData.subCategories[0] || 'General';
  const availableProductTypes =
    (subCategory && currentCategoryData.productTypes[subCategory]) ||
    currentCategoryData.productTypes[currentCategoryData.subCategories[0] || ''] ||
    [draftProduct.productType || 'Standard'];
  const productType = draftProduct.productType || availableProductTypes[0] || 'Standard';
  const productIdentification = draftProduct.productIdentification || 'new';
  const brand = draftProduct.brand || 'Generic / Unbranded';
  const hsnCode = draftProduct.hsnCode || '61091000';

  const handleCategoryChange = (newCat: string) => {
    const nextCatData = categoryCatalogTree[newCat];
    const nextSub = nextCatData ? nextCatData.subCategories[0] || 'General' : 'General';
    const nextTypes =
      (nextCatData && nextCatData.productTypes[nextSub]) || ['Standard'];
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
              Choose or type any category, sub-category, and product type to organize your catalog.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Category */}
              <CreatableCombobox
                label="Category"
                required
                leftIcon={<Shirt className="w-4 h-4 text-slate-400" />}
                value={category}
                options={Object.keys(categoryCatalogTree)}
                onChange={handleCategoryChange}
                placeholder="Select or type category..."
                itemTypeLabel="Category"
              />

              {/* Sub-category */}
              <CreatableCombobox
                label="Sub-category"
                required
                leftIcon={<ListFilter className="w-4 h-4 text-slate-400" />}
                value={subCategory}
                options={currentCategoryData.subCategories}
                onChange={handleSubCategoryChange}
                placeholder="Select or type sub-category..."
                itemTypeLabel="Sub-category"
              />

              {/* Product Type */}
              <CreatableCombobox
                label="Product Type"
                required
                leftIcon={<LayoutGrid className="w-4 h-4 text-slate-400" />}
                value={productType}
                options={availableProductTypes}
                onChange={(newPt) => updateDraftProduct({ productType: newPt })}
                placeholder="Select or type product type..."
                itemTypeLabel="Product Type"
              />
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
                <CreatableCombobox
                  label="Brand / Manufacturer"
                  required
                  value={brand}
                  options={commonBrandOptions}
                  onChange={(newBrand) => updateDraftProduct({ brand: newBrand })}
                  placeholder="Select or type brand..."
                  itemTypeLabel="Brand"
                />
                <div className="flex items-center justify-between mt-1.5 text-[11px]">
                  <span className="text-slate-500">For local or unbranded stock:</span>
                  <button
                    type="button"
                    onClick={() => updateDraftProduct({ brand: 'Generic / Unbranded' })}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
                  >
                    + Set as Unbranded
                  </button>
                </div>
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
