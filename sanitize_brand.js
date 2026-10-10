const fs = require('fs');

function replaceInFile(path, replacements, importToAdd = null) {
  try {
    let content = fs.readFileSync(path, 'utf8');
    if (importToAdd && !content.includes(importToAdd) && !content.includes('@repo/shared-types')) {
      const lines = content.split('\n');
      let lastImportIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        }
      }
      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, importToAdd);
        content = lines.join('\n');
      } else {
        content = importToAdd + '\n' + content;
      }
    }
    
    let changed = false;
    for (const [search, replace] of replacements) {
      if (typeof search === 'string') {
        if (content.includes(search)) {
          content = content.replaceAll(search, replace);
          changed = true;
        }
      } else if (search instanceof RegExp) {
        if (search.test(content)) {
          content = content.replace(search, replace);
          changed = true;
        }
      }
    }
    
    if (changed || importToAdd) {
      fs.writeFileSync(path, content, 'utf8');
      console.log('Updated ' + path);
    }
  } catch (e) {
    console.error('Failed to update ' + path + ': ' + e.message);
  }
}

replaceInFile('apps/mobile-customer/app/feedback.tsx', [
  ['How was your experience with Viztore?', 'How was your experience with {branding.appName}?'],
  ['Would you recommend Viztore to others?', 'Would you recommend {branding.appName} to others?']
], "import { branding } from '@repo/shared-types';");

replaceInFile('apps/mobile-customer/app/help-support.tsx', [
  ['Selling on Viztore', 'Selling on {branding.appName}'],
  ['support@viztore.com', '{branding.supportEmail}']
], "import { branding } from '@repo/shared-types';");

replaceInFile('apps/mobile-customer/app/order-details.tsx', [
  ['Thank you for shopping with Viztore!', 'Thank you for shopping with {branding.appName}!']
]);

replaceInFile('apps/mobile-customer/app/privacy-policy.tsx', [
  [/Viztore/g, '{branding.appName}']
], "import { branding } from '@repo/shared-types';");

replaceInFile('apps/mobile-customer/app/terms-conditions.tsx', [
  [/Viztore/g, '{branding.appName}']
], "import { branding } from '@repo/shared-types';");

replaceInFile('apps/mobile-customer/app/sell.tsx', [
  [/Viztore/g, '{branding.appName}']
], "import { branding } from '@repo/shared-types';");

replaceInFile('apps/web/src/components/layout/Footer.tsx', [
  [/viztore/g, '{branding.appName.toLowerCase()}'],
  [/Viztore/g, '{branding.appName}']
], "import { branding } from '@repo/shared-types';");

replaceInFile('apps/mobile-customer/app/logged-out.tsx', [
  [/Viztore/g, '{branding.appName}']
], "import { branding } from '@repo/shared-types';");

replaceInFile('apps/mobile-customer/app/products/[slug].tsx', [
  ['viztore', '{branding.appName.toLowerCase()}']
], "import { branding } from '@repo/shared-types';");

replaceInFile('apps/mobile-customer/app/category/[slug].tsx', [
  ['viztore', '{branding.appName.toLowerCase()}']
], "import { branding } from '@repo/shared-types';");

replaceInFile('apps/mobile-customer/app/(tabs)/categories.tsx', [
  ['viztore', '{branding.appName.toLowerCase()}']
], "import { branding } from '@repo/shared-types';");
