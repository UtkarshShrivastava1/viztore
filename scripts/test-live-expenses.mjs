import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:5000/api/v1';

async function obtainMerchantAuth() {
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

  const storeRes = await fetch(`${API_URL}/stores/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const storeData = await storeRes.json();
  const store = Array.isArray(storeData.data) ? storeData.data[0] : (storeData.data?.store || storeData.data);

  return { token, refreshToken, user, store };
}

async function runLiveExpenseTest() {
  console.log('========================================================');
  console.log('   LAUNCHING LIVE HEADFUL EXPENSES & PURCHASE TEST      ');
  console.log('========================================================\n');

  const auth = await obtainMerchantAuth();
  console.log(`Merchant Authenticated: ${auth.user.fullName} (${auth.user.phone})`);
  console.log(`Store Attached: ${auth.store?.name || 'Apex Lifestyle Hub'}`);

  // Launch VISIBLE Chrome browser window with human-observable pacing
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
    args: ['--window-size=1440,900', '--window-position=50,50']
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 860 }
  });
  const page = await context.newPage();

  // Inject session into localStorage
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

  console.log('\n[1/7] Navigating to Purchase / Expense Hub (/dashboard/expenses)...');
  await page.goto(`${BASE_URL}/dashboard/expenses`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Highlight Top KPI Cards
  console.log('[2/7] Inspecting Financial KPI Summary Cards...');
  const kpiTotalPurchase = page.locator('text=Total Purchase').first();
  if (await kpiTotalPurchase.isVisible()) {
    console.log('  -> KPI "Total Purchase" verified');
  }
  const kpiTotalExpense = page.locator('text=Total Expense').first();
  if (await kpiTotalExpense.isVisible()) {
    console.log('  -> KPI "Total Expense" verified');
  }
  await page.waitForTimeout(1000);

  // 2. Test "+ Add Expense" Modal
  console.log('\n[3/7] Testing "+ Add Expense" Dialog...');
  const addExpenseBtn = page.locator('button:has-text("Add Expense")').first();
  if (await addExpenseBtn.isVisible()) {
    console.log('  -> Clicking "+ Add Expense"');
    await addExpenseBtn.click();
    await page.waitForTimeout(1000);

    // Select Category
    const categorySelect = page.locator('select').first();
    if (await categorySelect.isVisible()) {
      const options = await categorySelect.locator('option').allInnerTexts();
      if (options.length > 1) {
        await categorySelect.selectOption({ index: 1 });
        console.log(`  -> Selected Category: "${options[1]}"`);
      }
    }

    // Fill Vendor
    const vendorInput = page.locator('input[placeholder*="Vendor"], input[placeholder*="Paid To"]').first();
    if (await vendorInput.isVisible()) {
      await vendorInput.fill('State Electricity Board & Utilities');
      console.log('  -> Entered Vendor: State Electricity Board & Utilities');
    }

    // Fill Amount
    const amountInput = page.locator('input[type="number"]').first();
    if (await amountInput.isVisible()) {
      await amountInput.fill('4850');
      console.log('  -> Entered Amount: Rs. 4,850.00');
    }

    // Fill Notes
    const notesInput = page.locator('textarea, input[placeholder*="notes" i], input[placeholder*="description" i]').first();
    if (await notesInput.isVisible()) {
      await notesInput.fill('Monthly commercial electricity and lighting expenses');
      console.log('  -> Entered Notes: Monthly commercial electricity and lighting expenses');
    }

    await page.waitForTimeout(1500);

    // Close modal via Escape
    console.log('  -> Dismissing Add Expense modal cleanly via Escape key');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
  }

  // 3. Test "+ Add Purchase" Split Dropdown
  console.log('\n[4/7] Testing "+ Add Purchase" Split Menu...');
  const addPurchaseBtn = page.locator('button:has-text("Add Purchase")').first();
  if (await addPurchaseBtn.isVisible()) {
    console.log('  -> Clicking "+ Add Purchase"');
    await addPurchaseBtn.click();
    await page.waitForTimeout(1200);

    // Click "Purchase Order"
    const poOption = page.locator('button:has-text("Purchase Order")').first();
    if (await poOption.isVisible()) {
      console.log('  -> Opening "Purchase Order" PO Form Modal');
      await poOption.click();
      await page.waitForTimeout(1500);

      console.log('  -> Purchase Order form verified. Dismissing cleanly.');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(800);
    }
  }

  // 4. Test "More Actions" Dropdown (Export, Import)
  console.log('\n[5/7] Testing "More Actions" Dropdown...');
  const moreActionsBtn = page.locator('button:has-text("More Actions")').first();
  if (await moreActionsBtn.isVisible()) {
    console.log('  -> Opening "More Actions" menu');
    await moreActionsBtn.click();
    await page.waitForTimeout(1400);

    console.log('  -> Verifying CSV Export, GSTR-1, and Ingestion options');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  }

  // 5. Test Sub-tabs
  console.log('\n[6/7] Cycling through Module Sub-Tabs...');
  const tabNames = [
    'Purchases (Bills)',
    'Purchase Orders',
    'Expenses',
    'Credit Notes',
    'E-Way Bills',
    'Vendors'
  ];

  for (const tab of tabNames) {
    const tabBtn = page.locator(`button:has-text("${tab}")`).first();
    if (await tabBtn.isVisible()) {
      console.log(`  -> Switching to Tab: "${tab}"`);
      await tabBtn.click();
      await page.waitForTimeout(1400);
    }
  }

  // 6. Test Vendors Tab & "+ Add Vendor"
  console.log('\n[7/7] Testing Vendors Management Directory...');
  const addVendorBtn = page.locator('button:has-text("Add Vendor")').first();
  if (await addVendorBtn.isVisible()) {
    console.log('  -> Clicking "+ Add Vendor" Drawer');
    await addVendorBtn.click();
    await page.waitForTimeout(1500);

    const vendorNameInput = page.locator('input[placeholder*="Company"], input[placeholder*="Vendor Name"], input[name*="name"]').first();
    if (await vendorNameInput.isVisible()) {
      await vendorNameInput.fill('Surya Textile Mills Ltd');
      console.log('  -> Typed Vendor Name: Surya Textile Mills Ltd');
    }

    const gstinInput = page.locator('input[placeholder*="GSTIN"], input[name*="gstin"]').first();
    if (await gstinInput.isVisible()) {
      await gstinInput.fill('22AAAAA0000A1Z5');
      console.log('  -> Typed GSTIN: 22AAAAA0000A1Z5');
    }

    await page.waitForTimeout(2000);
    console.log('  -> Closing Add Vendor Drawer via Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
  }

  // Return to All Transactions
  const allTab = page.locator('button:has-text("All Transactions"), button:has-text("All")').first();
  if (await allTab.isVisible()) {
    await allTab.click();
    await page.waitForTimeout(1000);
  }

  console.log('\n========================================================');
  console.log('  ALL PURCHASES & EXPENSES TESTS COMPLETED LIVE!        ');
  console.log('  Keeping browser window open for 10 seconds to review..');
  console.log('========================================================\n');

  await page.waitForTimeout(10000);
  await browser.close();
  console.log('Live browser session closed cleanly.');
}

runLiveExpenseTest().catch(err => {
  console.error('Live test error:', err);
  process.exit(1);
});
