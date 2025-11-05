#!/usr/bin/env node

/**
 * Post-build script to fix Netlify function bundling issue
 * 
 * netlify serve bundles functions to nested paths, but expects index.js
 * at the root. This script copies the bundled file to the expected location.
 */

const fs = require('fs');
const path = require('path');

const functionDir = path.join(__dirname, '..', '.netlify', 'functions-serve', '.unzipped', 'employee');
const bundledPath = path.join(functionDir, 'netlify', 'functions', 'employee', 'index.js');
const targetPath = path.join(functionDir, 'index.js');

// Check if the bundled file exists
if (fs.existsSync(bundledPath)) {
  // Copy it to the root
  fs.copyFileSync(bundledPath, targetPath);
  console.log('✓ Fixed Netlify function bundling: copied bundled index.js to function root');
} else {
  console.log('⚠ Netlify function bundle not found at:', bundledPath);
  console.log('  This is normal if netlify serve hasn\'t run yet.');
}

