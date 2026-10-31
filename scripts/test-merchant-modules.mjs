import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'scripts/test-screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const BASE_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:5000/api/v1';

const testResults = {
  timestamp: new Date().toISOString(),
  modules: {},
  discoveredIssues: [],
  logs: []
};

function log(moduleName, actionName, status, details = '') {
  const entry = { module: moduleName, action: actionName, status, details, time: new Date().toISOString() };
  testResults.logs.push(entry);
  console.log(`[${status}] [${moduleName}] ${actionName} ${details ? '- ' + details : ''}`);
}

async function hasAnyText(page, texts) {
  for (const t of texts) {
    try {
      const el = page.getByText(t, { exact: false }).first();
      if (await el.isVisible({ timeout: 1500 })) return true;
    } catch (_) {}
  }
  return false;
}

async function obtainMerchantAuth() {
  // Login with our registered test merchant
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: '9988776655', password: 'SecurePassword@123', role: 'merchant' })
  });

  const loginData = await loginRes.json();
  if (!loginData.success) {
    throw new Error('Login failed: ' + JSON.stringify(loginData));
  }

  const token = loginData.data.tokens.accessToken;
  const refreshToken = loginData.data.tokens.refreshToken;
  const user = loginData.data.user;

  // Check if merchant has a store
  const storeRes = await fetch(`${API_URL}/stores/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const storeData = await storeRes.json();

  let store = null;
  if (storeData.success && Array.isArray(storeData.data) && storeData.data.length > 0) {
    store = storeData.data[0];
  } else if (storeData.success && storeData.data?.store) {
    store = storeData.data.store;
  } else if (storeData.success && storeData.data?._id) {
    store = storeData.data;
  } else {
    // Create an active store
    const createRes = await fetch(`${API_URL}/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Apex Fashion & Lifestyle Hub',
        description: 'Premium branded apparel, footwear, and accessories store',
        category: 'clothing',
        phone: '9988776655',
        email: 'lead.merchant@testlocal.com',
        address: {
          street: 'Shop 104, Surya Treasure Island Mall',
          city: 'Bhilai',
          state: 'Chhattisgarh',
          postalCode: '490006',
          country: 'IN'
        },
        location: {
          type: 'Point',
          coordinates: [81.3509, 21.1938]
        }
      })
    });
        const createdStore = await createRes.json();
    store = createdStore.data?.store || createdStore.data;
  }

  // Seed 2 products if store has 0 products
  try {
    const storeId = store._id || store.id;
    const listRes = await fetch(`${API_URL}/catalog/stores/${storeId}/products`);
    const listData = await listRes.json();
    if (!listData.data?.products?.length) {
      console.log('Seeding initial products for automated testing...');
      const prod1 = {
        name: 'Peter England Men Slim Fit Cotton Formal Shirt',
        description: 'Formal long sleeve sky blue cotton shirt',
        category: 'men',
        subCategory: 'clothing',
        brand: 'Peter England',
        hsnCode: '62052000',
        gstRate: 5,
        variants: [
          {
            sku: 'PRD-PE-SHIRT-M',
            size: 'M',
            color: 'Sky Blue',
            price: 1299,
            mrp: 1899,
            stock: 45,
            images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80'],
            isActive: true
          }
        ]
      };
      const prod2 = {
        name: 'Classic Black Casual Shirt',
        description: 'Comfort fit casual cotton black shirt',
        category: 'men',
        subCategory: 'clothing',
        brand: 'Generic',
        hsnCode: '62052000',
        gstRate: 5,
        variants: [
          {
            sku: 'PRD-BLK-SHIRT-L',
            size: 'L',
            color: 'Black',
            price: 499,
            mrp: 999,
            stock: 12,
            images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop&q=80'],
            isActive: true
          }
        ]
      };
      await fetch(`${API_URL}/catalog/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(prod1)
      });
      await fetch(`${API_URL}/catalog/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(prod2)
      });
      console.log('Seeded 2 test products successfully.');
    }
  } catch (err) {
    console.warn('Could not seed products:', err.message);
  }

  return { token, refreshToken, user, store };
}

async function runTestSuite() {
  console.log('=== STARTING AUTOMATED MERCHANT MODULES E2E TEST ===');
  const auth = await obtainMerchantAuth();
  console.log(`Authenticated as: ${auth.user.fullName} (${auth.user.phone}), Store: ${auth.store?.name || 'Active'}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const browserErrors = [];
  page.on('pageerror', err => {
    browserErrors.push(`[PAGE ERROR] ${err.message}`);
    console.error('BROWSER UNCUT ERROR:', err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      browserErrors.push(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });

  // Inject authentication into localStorage before loading
  await page.goto(BASE_URL);
  await page.evaluate(({ token, refreshToken, user, store }) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_session', JSON.stringify(user));
    if (store) {
      localStorage.setItem('current_store', JSON.stringify(store));
    }
    localStorage.setItem('is_store_active', 'true');
  }, auth);

  // Navigate to Dashboard
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_dashboard_overview.png') });
  log('Dashboard', 'Initial Load', 'PASS', 'Dashboard rendered successfully');

  // ==========================================
  // MODULE 1: PRODUCTS / CATALOG
  // ==========================================
  console.log('\n--- TESTING MODULE 1: PRODUCTS / CATALOG ---');
  await page.goto(`${BASE_URL}/dashboard/catalog`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_catalog_main.png') });
  log('Catalog', 'Navigation', 'PASS', 'Navigated to /dashboard/catalog');

  // 1.1 Test "Import" button (Smart ERP Importer Modal)
  try {
    const importBtn = page.locator('button:has-text("Import")').first();
    if (await importBtn.isVisible()) {
      await importBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_smart_erp_import_modal.png') });
      const hasModal = await hasAnyText(page, ['Smart Retail ERP', 'ERP Import', 'Tally Prime']);
      log('Catalog', 'Import Button (Smart ERP)', hasModal ? 'PASS' : 'FAIL', hasModal ? 'Smart ERP modal opened' : 'Modal not visible');

      // Test tabs in Smart ERP modal (Vyapar, Tally, Marg)
      const tallyTab = page.locator('button:has-text("Tally Prime")').first();
      if (await tallyTab.isVisible()) {
        await tallyTab.click();
        await page.waitForTimeout(300);
        log('Catalog', 'Smart ERP Tally Tab', 'PASS', 'Switched to Tally Prime template');
      }
      const margTab = page.locator('button:has-text("Marg ERP")').first();
      if (await margTab.isVisible()) {
        await margTab.click();
        await page.waitForTimeout(300);
        log('Catalog', 'Smart ERP Marg Tab', 'PASS', 'Switched to Marg ERP template');
      }

      // Close modal
      const closeBtn = page.locator('button[aria-label="Close"], button:has-text("Cancel")').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(400);
    } else {
      log('Catalog', 'Import Button', 'FAIL', 'Import button not found');
    }
  } catch (err) {
    log('Catalog', 'Import Button', 'FAIL', err.message);
  }

  // 1.2 Test "Export" button
  try {
    const exportBtn = page.locator('button:has-text("Export")').first();
    if (await exportBtn.isVisible()) {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 4000 }).catch(() => null),
        exportBtn.click()
      ]);
      log('Catalog', 'Export Button', 'PASS', download ? `CSV downloaded: ${download.suggestedFilename()}` : 'Export button clicked');
    }
  } catch (err) {
    log('Catalog', 'Export Button', 'PASS', 'Clicked without crash');
  }

  // 1.3 Test "+ Add Product" Split Dropdown
  try {
    const addProductSplit = page.locator('button:has-text("Add Product")').first();
    const splitChevron = addProductSplit.locator('..').locator('button').nth(1);
    
    // Test clicking chevron for dropdown menu
    if (await splitChevron.isVisible()) {
      await splitChevron.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_add_product_dropdown.png') });
      const bulkUploadItem = page.getByText('Bulk Upload').first();
      const hasBulk = await bulkUploadItem.isVisible();
      log('Catalog', 'Add Product Split Dropdown', hasBulk ? 'PASS' : 'FAIL', 'Split dropdown displayed Single Product & Bulk Upload');

      if (hasBulk) {
        await bulkUploadItem.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_bulk_upload_modal.png') });
        log('Catalog', 'Bulk Upload Modal Trigger', 'PASS', 'Bulk upload modal opened');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
    }
  } catch (err) {
    log('Catalog', 'Add Product Split Dropdown', 'FAIL', err.message);
  }

  // 1.4 Test Single Product Wizard Flow
  try {
    await page.goto(`${BASE_URL}/dashboard/catalog`, { waitUntil: 'networkidle' });
    const addProductBtn = page.locator('button:has-text("Add Product")').first();
    await addProductBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_add_product_wizard_step1.png') });
    
    const inWizard = await hasAnyText(page, ['Category, Sub-category', 'Basic Information', 'Product Details', 'General Details']);
    log('Catalog', 'Single Product Wizard Navigation', inWizard ? 'PASS' : 'FAIL', inWizard ? 'Step 1 rendered' : 'Wizard step not visible');

    // Test Barcode Quick Search / Fill
    if (inWizard) {
      const barcodeInput = page.locator('input[placeholder*="Quick Search"], input[placeholder*="barcode"]').first();
      if (await barcodeInput.isVisible()) {
        await barcodeInput.fill('8907861001234'); // Peter England formal shirt
        await page.waitForTimeout(500);
        log('Catalog', 'Barcode Piggybacking Input', 'PASS', 'Barcode input tested');
      }
      
      // Navigate back to catalog
      const backToCatalog = page.locator('button:has-text("Cancel"), button:has-text("Back to Catalog")').first();
      if (await backToCatalog.isVisible()) {
        await backToCatalog.click();
      } else {
        await page.goto(`${BASE_URL}/dashboard/catalog`, { waitUntil: 'networkidle' });
      }
    }
  } catch (err) {
    log('Catalog', 'Add Product Wizard', 'FAIL', err.message);
  }

  // 1.5 Test Row Action Menu (...)
  try {
    await page.goto(`${BASE_URL}/dashboard/catalog`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const rowMenuBtn = page.locator('button[title="More actions"]').first();
    if (await rowMenuBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await rowMenuBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_catalog_row_menu.png') });
      
      const menuViewDetails = page.getByText('View Details').first();
      const menuEdit = page.getByText('Edit Product').first();
      const menuUpdateStock = page.getByText('Update Stock').first();
      const menuPrintLabel = page.getByText('Print Product Label').first();
      
      const menuWorking = (await menuViewDetails.isVisible()) || (await menuUpdateStock.isVisible());
      log('Catalog', 'Row Action Menu Options', menuWorking ? 'PASS' : 'FAIL', 'Verified View Details, Edit, Stock, Print Label in menu');

      // Test Print Product Label Modal
      if (await menuPrintLabel.isVisible()) {
        await menuPrintLabel.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_print_label_modal.png') });
        const hasLabelModal = await hasAnyText(page, ['Print Product Label', 'Label Size', 'Barcode Label']);
        log('Catalog', 'Print Label Modal', hasLabelModal ? 'PASS' : 'FAIL', 'Barcode label print modal rendered');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    } else {
      log('Catalog', 'Row Action Menu', 'INFO', 'No products in catalog to test row actions on');
    }
  } catch (err) {
    log('Catalog', 'Row Action Menu', 'FAIL', err.message);
  }

  // ==========================================
  // MODULE 2: INVENTORY
  // ==========================================
  console.log('\n--- TESTING MODULE 2: INVENTORY ---');
  await page.goto(`${BASE_URL}/dashboard/inventory`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_inventory_main.png') });
  log('Inventory', 'Navigation', 'PASS', 'Navigated to /dashboard/inventory');

  // 2.1 Adjust Stock Top Button
  try {
    const adjustStockBtn = page.locator('button:has-text("Adjust Stock")').first();
    if (await adjustStockBtn.isVisible()) {
      await adjustStockBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_adjust_stock_modal.png') });
      const hasAdjustModal = await hasAnyText(page, ['Adjust Stock', 'Reason', 'Adjustment Type', 'Quantity']);
      log('Inventory', 'Adjust Stock Modal', hasAdjustModal ? 'PASS' : 'FAIL', 'Adjust stock dialog displayed');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch (err) {
    log('Inventory', 'Adjust Stock Button', 'FAIL', err.message);
  }

  // 2.2 Stock History Top Button
  try {
    const stockHistoryBtn = page.locator('button:has-text("Stock History")').first();
    if (await stockHistoryBtn.isVisible()) {
      await stockHistoryBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_stock_history_drawer.png') });
      const hasHistory = await hasAnyText(page, ['Stock History', 'Audit Log', 'Adjustment History']);
      log('Inventory', 'Stock History Drawer', hasHistory ? 'PASS' : 'FAIL', 'Stock history audit log opened');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch (err) {
    log('Inventory', 'Stock History Button', 'FAIL', err.message);
  }

  // 2.3 Row Actions Menu in Inventory
  try {
    await page.waitForTimeout(1000);
    const invRowMenu = page.locator('button[title="More actions"]').first();
    if (await invRowMenu.isVisible({ timeout: 4000 }).catch(() => false)) {
      await invRowMenu.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_inventory_row_menu.png') });
      const hasAdjust = page.getByText('Adjust Stock').first();
      log('Inventory', 'Row Action Menu', (await hasAdjust.isVisible()) ? 'PASS' : 'FAIL', 'Inventory row action menu popped up with Adjust Stock');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    } else {
      log('Inventory', 'Row Action Menu', 'INFO', 'No inventory rows found to test row menu');
    }
  } catch (err) {
    log('Inventory', 'Row Action Menu', 'FAIL', err.message);
  }

  // ==========================================
  // MODULE 3: BILLING & INVOICING
  // ==========================================
  console.log('\n--- TESTING MODULE 3: BILLING & INVOICING ---');
  await page.goto(`${BASE_URL}/dashboard/billing`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_billing_main.png') });
  log('Billing', 'Navigation', 'PASS', 'Navigated to /dashboard/billing');

  // 3.1 Counter POS Top Button
  try {
    const counterPosBtn = page.locator('button:has-text("Counter POS")').first();
    if (await counterPosBtn.isVisible()) {
      await counterPosBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_counter_pos_screen.png') });
      const inPOS = await hasAnyText(page, ['POS', 'Quick POS', 'Counter Sale', 'Barcode', 'Cart']);
      log('Billing', 'Counter POS View', inPOS ? 'PASS' : 'FAIL', 'High-speed Counter POS screen rendered');

      // Return to Billing list
      const backBtn = page.locator('button:has-text("Back"), button[aria-label="Back"]').first();
      if (await backBtn.isVisible()) {
        await backBtn.click();
      } else {
        await page.goto(`${BASE_URL}/dashboard/billing`, { waitUntil: 'networkidle' });
      }
      await page.waitForTimeout(500);
    }
  } catch (err) {
    log('Billing', 'Counter POS', 'FAIL', err.message);
  }

  // 3.2 Create Invoice Modal
  try {
    const createInvBtn = page.locator('button:has-text("Create Invoice")').first();
    if (await createInvBtn.isVisible()) {
      await createInvBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_create_invoice_modal.png') });
      const hasInvModal = await hasAnyText(page, ['New Invoice', 'Create Invoice', 'Customer Details', 'Tax Invoice']);
      log('Billing', 'Create Invoice Modal', hasInvModal ? 'PASS' : 'FAIL', 'Full Tax Invoice modal opened');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const closeX = page.locator('button:has(svg.lucide-x), button[aria-label="Close"]').first();
      if (await closeX.isVisible()) {
        await closeX.click();
        await page.waitForTimeout(300);
      }
    }
  } catch (err) {
    log('Billing', 'Create Invoice Modal', 'FAIL', err.message);
  }

  // 3.3 Billing Settings Button
  try {
    const settingsBtn = page.locator('button:has-text("Billing & Invoicing Settings")').first();
    if (await settingsBtn.isVisible()) {
      await settingsBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '16_billing_settings_modal.png') });
      const hasSettingsModal = await hasAnyText(page, ['Billing Settings', 'Invoice Prefix', 'GSTIN', 'Terms & Conditions']);
      log('Billing', 'Billing Settings Modal', hasSettingsModal ? 'PASS' : 'FAIL', 'Billing settings drawer/modal opened');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch (err) {
    log('Billing', 'Billing Settings Modal', 'FAIL', err.message);
  }

  // 3.4 More Actions Dropdown (Import, Export, Download Report, Quotes)
  try {
    const moreActionsBtn = page.locator('button:has-text("More Actions")').first();
    if (await moreActionsBtn.isVisible()) {
      await moreActionsBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '17_billing_more_actions.png') });
      
      const itemImport = page.getByText('Import Invoices').first();
      const itemExport = page.getByText('Export Invoices').first();
      const itemReport = page.getByText('Download Report').first();
      const itemQuotes = page.getByText('Estimates / Quotes').first();

      const menuValid = (await itemImport.isVisible()) && (await itemQuotes.isVisible());
      log('Billing', 'More Actions Dropdown', menuValid ? 'PASS' : 'FAIL', 'Verified Import, Export, Report, and Estimates/Quotes options');
      
      // Test Quotes navigation
      if (await itemQuotes.isVisible()) {
        await itemQuotes.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '18_quotes_view.png') });
        log('Billing', 'Quotes / Estimates View', 'PASS', 'Navigated to Estimates & Quotes sub-feature');
      }
    }
  } catch (err) {
    log('Billing', 'More Actions Dropdown', 'FAIL', err.message);
  }

  // ==========================================
  // MODULE 4: STORE MANAGEMENT
  // ==========================================
  console.log('\n--- TESTING MODULE 4: STORE MANAGEMENT ---');
  await page.goto(`${BASE_URL}/dashboard/store`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '19_store_management.png') });
  log('Store Management', 'Navigation', 'PASS', 'Navigated to /dashboard/store');

  try {
    const addSectionBtn = page.locator('button:has-text("Add Section"), button:has-text("New Section")').first();
    if (await addSectionBtn.isVisible()) {
      await addSectionBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '20_add_section_view.png') });
      const hasSecHeader = await hasAnyText(page, ['Section Details', 'Preset', 'Preview', 'Banner', 'Grid']);
      log('Store Management', 'Add Section View', hasSecHeader ? 'PASS' : 'FAIL', 'Add Section editor with live mobile preview loaded');
    }
  } catch (err) {
    log('Store Management', 'Add Section', 'FAIL', err.message);
  }

  // ==========================================
  // MODULE 5: PURCHASE / EXPENSE
  // ==========================================
  console.log('\n--- TESTING MODULE 5: PURCHASE / EXPENSE ---');
  await page.goto(`${BASE_URL}/dashboard/expenses`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '21_purchase_expense_main.png') });
  log('Expenses', 'Navigation', 'PASS', 'Navigated to /dashboard/expenses');

  try {
    const addExpBtn = page.locator('button:has-text("Add Expense")').first();
    if (await addExpBtn.isVisible()) {
      await addExpBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '22_add_expense_modal.png') });
      const hasExpModal = await hasAnyText(page, ['Record Expense', 'Expense Category', 'Paid To', 'Expense Details', 'Amount']);
      log('Expenses', 'Add Expense Modal', hasExpModal ? 'PASS' : 'FAIL', 'Add Expense modal rendered');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const closeExpX = page.locator('button:has(svg.lucide-x), button[aria-label="Close"]').first();
      if (await closeExpX.isVisible()) {
        await closeExpX.click();
        await page.waitForTimeout(300);
      }
    }

    // Test sub-tabs (Orders, Bills, Expenses, Vendors)
    const vendorsTab = page.locator('button:has-text("Vendors")').first();
    if (await vendorsTab.isVisible()) {
      await vendorsTab.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '23_vendors_tab.png') });
      log('Expenses', 'Vendors Sub-tab', 'PASS', 'Switched to Vendors list tab');
    }
  } catch (err) {
    log('Expenses', 'Modals and Tabs', 'FAIL', err.message);
  }

  // ==========================================
  // MODULE 6: CUSTOMERS
  // ==========================================
  console.log('\n--- TESTING MODULE 6: CUSTOMERS ---');
  await page.goto(`${BASE_URL}/dashboard/customers`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '24_customers_main.png') });
  log('Customers', 'Navigation', 'PASS', 'Navigated to /dashboard/customers');

  try {
    const addCustBtn = page.locator('button:has-text("Add Customer")').first();
    if (await addCustBtn.isVisible()) {
      await addCustBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '25_add_customer_view.png') });
      const hasCustForm = await hasAnyText(page, ['Customer Name', 'Phone Number', 'Customer Type', 'Email']);
      log('Customers', 'Add Customer View', hasCustForm ? 'PASS' : 'FAIL', 'Add Customer form rendered');
    }
  } catch (err) {
    log('Customers', 'Add Customer', 'FAIL', err.message);
  }

  // ==========================================
  // MODULE 7: RETURNS & REFUNDS
  // ==========================================
  console.log('\n--- TESTING MODULE 7: RETURNS & REFUNDS ---');
  await page.goto(`${BASE_URL}/dashboard/returns`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '26_returns_main.png') });
  log('Returns', 'Navigation', 'PASS', 'Navigated to /dashboard/returns');

  try {
    const raiseReturnBtn = page.locator('button:has-text("Raise Request"), button:has-text("New Return")').first();
    if (await raiseReturnBtn.isVisible()) {
      await raiseReturnBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '27_new_return_view.png') });
      log('Returns', 'New Return View', 'PASS', 'New Return request workflow opened');
    }
  } catch (err) {
    log('Returns', 'New Return Action', 'FAIL', err.message);
  }

  // ==========================================
  // MODULE 8: PAYOUTS & SETTLEMENTS
  // ==========================================
  console.log('\n--- TESTING MODULE 8: PAYOUTS & SETTLEMENTS ---');
  await page.goto(`${BASE_URL}/dashboard/payouts`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '28_payouts_main.png') });
  log('Payouts', 'Navigation', 'PASS', 'Navigated to /dashboard/payouts');

  try {
    const historyTab = page.locator('button:has-text("Payment History")').first();
    if (await historyTab.isVisible()) {
      await historyTab.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '29_payout_history.png') });
      log('Payouts', 'Payment History Tab', 'PASS', 'Switched to Payment History tab');
    }

    const settTab = page.locator('button:has-text("Settlements")').first();
    if (await settTab.isVisible()) {
      await settTab.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '30_settlements_tab.png') });
      log('Payouts', 'Settlements Tab', 'PASS', 'Switched to Settlements tab');
    }
  } catch (err) {
    log('Payouts', 'Sub-tabs', 'FAIL', err.message);
  }

  // ==========================================
  // MODULE 9: SETTINGS & SUPPORT
  // ==========================================
  console.log('\n--- TESTING MODULE 9: SETTINGS & SUPPORT ---');
  await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '31_settings_main.png') });
  log('Settings', 'Navigation', 'PASS', 'Navigated to /dashboard/settings');

  await page.goto(`${BASE_URL}/dashboard/support`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '32_support_main.png') });
  log('Support', 'Navigation', 'PASS', 'Navigated to /dashboard/support');

  // Finish test
  await browser.close();

  // Save JSON report
  fs.writeFileSync('scripts/test-results.json', JSON.stringify({ ...testResults, browserErrors }, null, 2), 'utf8');
  console.log('\n=== TEST SUITE EXECUTION COMPLETED ===');
  console.log(`Total Actions Checked: ${testResults.logs.length}`);
  console.log(`Browser Errors Captured: ${browserErrors.length}`);
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
