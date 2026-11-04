import { performance } from 'perf_hooks';

interface ProbeTest {
  id: string;
  category: 'INFRA' | 'API' | 'DISCOVERY' | 'CATALOG' | 'WEB' | 'MERCHANT' | 'SEO';
  name: string;
  url: string;
  method?: string;
  expectedStatus: number | number[];
  validate?: (data: any, text: string) => boolean | string;
}

interface TestResult {
  id: string;
  category: string;
  name: string;
  url: string;
  status: number;
  latencyMs: number;
  passed: boolean;
  message?: string;
}

const tests: ProbeTest[] = [
  // 1. INFRASTRUCTURE & GATEWAYS
  {
    id: 'INFRA-01',
    category: 'INFRA',
    name: 'Backend Gateway Healthz',
    url: 'https://api.viztore.com/healthz',
    expectedStatus: 200,
    validate: (data) => data.success === true && data.data?.status === 'healthy',
  },
  {
    id: 'INFRA-02',
    category: 'INFRA',
    name: 'Customer Web Front Gateway',
    url: 'https://www.viztore.com/',
    expectedStatus: 200,
    validate: (_, text) => text.includes('<!DOCTYPE html>') && text.includes('html'),
  },
  {
    id: 'INFRA-03',
    category: 'INFRA',
    name: 'Merchant / Seller Hub Gateway',
    url: 'https://seller.viztore.com/',
    expectedStatus: 200,
    validate: (_, text) => text.includes('<!DOCTYPE html>') && text.includes('root'),
  },

  // 2. DISCOVERY & GEOSPATIAL ENGINE
  {
    id: 'DISC-01',
    category: 'DISCOVERY',
    name: 'Active Approved Stores List',
    url: 'https://api.viztore.com/api/v1/stores',
    expectedStatus: 200,
    validate: (data) => Array.isArray(data.data) && data.data.length > 0,
  },
  {
    id: 'DISC-02',
    category: 'DISCOVERY',
    name: 'Durg-Bhilai Regional Proximity (Borsi GPS Coordinates)',
    url: 'https://api.viztore.com/api/v1/stores/nearby?lng=81.309&lat=21.159&radiusKm=50&city=Borsi',
    expectedStatus: 200,
    validate: (data) => {
      if (!Array.isArray(data.data) || data.data.length === 0) return 'No nearby stores returned';
      const first = data.data[0];
      const second = data.data[1];
      if (second && first.distanceKm > second.distanceKm) return 'Stores not in ascending distance order';
      return true;
    },
  },
  {
    id: 'DISC-03',
    category: 'DISCOVERY',
    name: 'Durg-Bhilai Regional Proximity (Supela GPS Coordinates)',
    url: 'https://api.viztore.com/api/v1/stores/nearby?lng=81.335&lat=21.196&radiusKm=50&city=Supela',
    expectedStatus: 200,
    validate: (data) => Array.isArray(data.data) && data.data.length > 0,
  },

  // 3. CATALOG & SEARCH
  {
    id: 'CAT-01',
    category: 'CATALOG',
    name: 'Master Taxonomy Categories',
    url: 'https://api.viztore.com/api/v1/catalog/taxonomy/categories',
    expectedStatus: 200,
    validate: (data) => Array.isArray(data.data) && data.data.length > 0,
  },
  {
    id: 'CAT-02',
    category: 'CATALOG',
    name: 'Active Products Listing',
    url: 'https://api.viztore.com/api/v1/catalog/products?limit=10',
    expectedStatus: 200,
    validate: (data) => Array.isArray(data.data) && data.data.length > 0,
  },
  {
    id: 'CAT-03',
    category: 'CATALOG',
    name: 'Multi-Field Product Search',
    url: 'https://api.viztore.com/api/v1/catalog/products?search=Origin',
    expectedStatus: 200,
    validate: (data) => Array.isArray(data.data) && data.data.length > 0,
  },
  {
    id: 'CAT-04',
    category: 'CATALOG',
    name: 'Category Isolated Product Query',
    url: 'https://api.viztore.com/api/v1/catalog/products?category=electronics',
    expectedStatus: 200,
    validate: (data) => Array.isArray(data.data) && data.data.length > 0,
  },

  // 4. CUSTOMER WEB ROUTES (SSR / NEXT.JS)
  {
    id: 'WEB-01',
    category: 'WEB',
    name: 'Customer Stores Directory (/stores)',
    url: 'https://www.viztore.com/stores',
    expectedStatus: 200,
    validate: (_, text) => text.includes('<!DOCTYPE html>'),
  },
  {
    id: 'WEB-02',
    category: 'WEB',
    name: 'Customer Deals Hub (/deals)',
    url: 'https://www.viztore.com/deals',
    expectedStatus: 200,
    validate: (_, text) => text.includes('<!DOCTYPE html>'),
  },
  {
    id: 'WEB-03',
    category: 'WEB',
    name: 'Category Page (/category/electronics)',
    url: 'https://www.viztore.com/category/electronics',
    expectedStatus: 200,
    validate: (_, text) => text.includes('<!DOCTYPE html>'),
  },
  {
    id: 'WEB-04',
    category: 'WEB',
    name: 'Customer Cart View (/cart)',
    url: 'https://www.viztore.com/cart',
    expectedStatus: 200,
    validate: (_, text) => text.includes('<!DOCTYPE html>'),
  },

  // 5. SEO & ROBOTS
  {
    id: 'SEO-01',
    category: 'SEO',
    name: 'Dynamic XML Sitemap (/sitemap.xml)',
    url: 'https://www.viztore.com/sitemap.xml',
    expectedStatus: 200,
    validate: (_, text) => text.includes('<?xml') && text.includes('urlset'),
  },
  {
    id: 'SEO-02',
    category: 'SEO',
    name: 'Robots Policy (/robots.txt)',
    url: 'https://www.viztore.com/robots.txt',
    expectedStatus: 200,
    validate: (_, text) => text.toLowerCase().includes('user-agent'),
  },
];

async function runProductionTestSuite() {
  console.log('\n================================================================');
  console.log('🌐 VIZTORE PLATFORM — LIVE PRODUCTION SYSTEM VERIFICATION SUITE');
  console.log('================================================================');
  console.log(`Execution Timestamp: ${new Date().toISOString()}`);
  console.log(`Audited Hosts:`);
  console.log(`  • Production API:      https://api.viztore.com (AWS EC2 18.60.59.40)`);
  console.log(`  • Customer Storefront: https://www.viztore.com (Vercel Production)`);
  console.log(`  • Merchant / Seller:   https://seller.viztore.com (Vercel Production)\n`);

  const results: TestResult[] = [];
  let passCount = 0;
  let failCount = 0;

  for (const t of tests) {
    const start = performance.now();
    try {
      const res = await fetch(t.url, {
        method: t.method || 'GET',
        headers: {
          'User-Agent': 'Viztore-Production-Audit/1.0 (+https://viztore.com)',
        },
      });
      const latencyMs = Math.round(performance.now() - start);
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        // HTML or plain text
      }

      const expectedStatuses = Array.isArray(t.expectedStatus) ? t.expectedStatus : [t.expectedStatus];
      const statusOk = expectedStatuses.includes(res.status);

      let validationOk: boolean | string = true;
      if (statusOk && t.validate) {
        validationOk = t.validate(data, text);
      }

      const passed = statusOk && validationOk === true;
      const message = !statusOk
        ? `HTTP status ${res.status} (expected ${expectedStatuses.join('/')})`
        : typeof validationOk === 'string'
        ? validationOk
        : 'OK';

      if (passed) passCount++;
      else failCount++;

      results.push({
        id: t.id,
        category: t.category,
        name: t.name,
        url: t.url,
        status: res.status,
        latencyMs,
        passed,
        message,
      });

      const icon = passed ? '✅' : '❌';
      console.log(`${icon} [${t.id}] ${t.name.padEnd(46)} | ${res.status} | ${latencyMs.toString().padStart(4)}ms | ${message}`);
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      failCount++;
      results.push({
        id: t.id,
        category: t.category,
        name: t.name,
        url: t.url,
        status: 0,
        latencyMs,
        passed: false,
        message: err.message,
      });
      console.log(`❌ [${t.id}] ${t.name.padEnd(46)} | ERR | ${latencyMs.toString().padStart(4)}ms | ${err.message}`);
    }
  }

  console.log('\n================================================================');
  console.log(`📊 LIVE PRODUCTION AUDIT SCORECARD:`);
  console.log(`   Passed:  ${passCount} / ${tests.length} tests (${Math.round((passCount / tests.length) * 100)}%)`);
  console.log(`   Failed:  ${failCount} / ${tests.length} tests`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runProductionTestSuite();
