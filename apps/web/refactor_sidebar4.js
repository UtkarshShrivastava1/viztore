const fs = require('fs');

const files = [
  'd:/Projects/NEXT_PROJECT/Viztore_next/viztore/apps/web/src/app/account/support/SupportClient.tsx',
  'd:/Projects/NEXT_PROJECT/Viztore_next/viztore/apps/web/src/app/account/sell/SellClient.tsx',
  'd:/Projects/NEXT_PROJECT/Viztore_next/viztore/apps/web/src/app/account/privacy/PrivacyClient.tsx',
  'd:/Projects/NEXT_PROJECT/Viztore_next/viztore/apps/web/src/app/account/logout/LogoutClient.tsx',
  'd:/Projects/NEXT_PROJECT/Viztore_next/viztore/apps/web/src/app/account/feedback/FeedbackClient.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  const sidebarRegex = /\{\/\* Left Sidebar \*\/\}[\s\S]*?(?=\{\/\* Right Content)/;
  if (sidebarRegex.test(content)) {
    content = content.replace(sidebarRegex, '{/* Left Sidebar */}\n        <AccountSidebar />\n\n        ');
  }

  const menuLinkRegex = /function MenuLink\(\{[\s\S]*?\}\) \{[\s\S]*?return \([\s\S]*?\);\n\}\n*/;
  content = content.replace(menuLinkRegex, '');

  if (!content.includes('AccountSidebar')) {
    const importMatch = content.match(/import .* from '.*';\n/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, lastImport + "import { AccountSidebar } from '@/components/account/AccountSidebar';\n");
    } else {
        content = "import { AccountSidebar } from '@/components/account/AccountSidebar';\n" + content;
    }
  }

  if (original !== content) {
    fs.writeFileSync(file, content);
    console.log('Modified:', file);
  }
});
