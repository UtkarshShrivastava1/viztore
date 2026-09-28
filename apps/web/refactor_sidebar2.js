const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const dirPath = 'd:/Projects/NEXT_PROJECT/Viztore_next/viztore/apps/web/src/app/account';

walkDir(dirPath, (filePath) => {
  if (!filePath.endsWith('.tsx') || filePath.includes('AccountSidebar.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Replace Sidebar
  const sidebarRegex = /<div className="hidden lg:block w-\[280px\][\s\S]*?(?=\{\/\* ================= RIGHT MAIN CONTENT)/;
  if (sidebarRegex.test(content)) {
    content = content.replace(sidebarRegex, '<AccountSidebar />\n\n        ');
  } else {
     // fallback if comment is different
     const fallbackRegex = /<div className="hidden lg:block w-\[280px\][\s\S]*?(?=<div className="flex-1 w-full flex flex-col)/;
     if (fallbackRegex.test(content)) {
        content = content.replace(fallbackRegex, '<AccountSidebar />\n\n        ');
     } else {
        const fallbackRegex2 = /<div className="hidden lg:block w-\[280px\][\s\S]*?(?=<div className="flex-1 w-full lg:mt-6)/;
        if (fallbackRegex2.test(content)) {
           content = content.replace(fallbackRegex2, '<AccountSidebar />\n\n        ');
        }
     }
  }

  // Remove MenuLink definition
  const menuLinkRegex = /function MenuLink\(\{.*?\}\: any\) \{[\s\S]*?return \([\s\S]*?\);\n\}\n*/g;
  content = content.replace(menuLinkRegex, '');

  // Add AccountSidebar import if needed
  if (original !== content && !content.includes('AccountSidebar')) {
    const importMatch = content.match(/import .* from '.*';\n/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, lastImport + "import { AccountSidebar } from '@/components/account/AccountSidebar';\n");
    } else {
        content = "import { AccountSidebar } from '@/components/account/AccountSidebar';\n" + content;
    }
  }

  if (original !== content) {
    console.log('Modified:', filePath);
    fs.writeFileSync(filePath, content);
  }
});
