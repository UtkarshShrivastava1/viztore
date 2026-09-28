const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/app/account', (filePath) => {
  if (filePath.endsWith('.tsx')) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('<AccountSidebar />') && !content.includes('import { AccountSidebar }')) {
      const match = content.match(/import .* from '.*';\n/g);
      if (match) {
        const lastImport = match[match.length - 1];
        const newContent = content.replace(lastImport, lastImport + "import { AccountSidebar } from '@/components/account/AccountSidebar';\n");
        fs.writeFileSync(filePath, newContent);
        console.log('Fixed:', filePath);
      } else {
        const newContent = "import { AccountSidebar } from '@/components/account/AccountSidebar';\n" + content;
        fs.writeFileSync(filePath, newContent);
        console.log('Fixed:', filePath);
      }
    }
  }
});
