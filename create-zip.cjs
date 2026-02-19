const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a file to stream archive data to
const output = fs.createWriteStream('the-empire-affiliate-marketing-hub.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log('✅ ZIP created successfully!');
  console.log(`📦 Total bytes: ${archive.pointer()}`);
  console.log('🚀 THE EMPIRE PROJECT ZIP IS READY FOR DOWNLOAD!');
});

// Good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

// Good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files and directories, excluding specified patterns
const excludePatterns = [
  'node_modules',
  '.git',
  'dist',
  'logs',
  '.env',
  '*.log',
  'the-empire-affiliate-marketing-hub.zip',
  'create-zip.js'
];

// Function to check if path should be excluded
function shouldExclude(filePath) {
  return excludePatterns.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

// Add all files and directories recursively
function addDirectory(dirPath, zipPath = '') {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const relativePath = zipPath ? path.join(zipPath, item) : item;
    
    if (shouldExclude(relativePath)) {
      return;
    }
    
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      addDirectory(fullPath, relativePath);
    } else {
      archive.file(fullPath, { name: relativePath });
    }
  });
}

console.log('🔄 Creating THE EMPIRE project ZIP package...');
addDirectory('.');

// Finalize the archive
archive.finalize();