const fs = require('fs');
const path = require('path');

const cacheDirs = [
  '.next',
  'node_modules/.cache',
];

console.log('🧹 Clearing cache directories...\n');

cacheDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Cleared: ${dir}`);
    } catch (error) {
      console.error(`❌ Error clearing ${dir}:`, error.message);
    }
  } else {
    console.log(`⏭️  Skipped: ${dir} (not found)`);
  }
});

console.log('\n✨ Cache cleanup complete!');
