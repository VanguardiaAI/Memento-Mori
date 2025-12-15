// Script to generate PWA icons from SVG
// Run with: node scripts/generate-icons.js
// Requires: npm install sharp

const fs = require('fs');
const path = require('path');

// Since we can't use sharp without installing it first,
// we'll create simple placeholder PNGs using a different approach
// or document how to generate them

console.log(`
=============================================
PWA Icon Generation Instructions
=============================================

To generate the required PWA icons, you have several options:

1. Use an online tool:
   - Go to https://realfavicongenerator.net/
   - Upload the icon.svg from public/icon.svg
   - Download and extract the generated icons
   - Rename them to icon-192x192.png and icon-512x512.png

2. Use ImageMagick (if installed):
   convert public/icon.svg -resize 192x192 public/icon-192x192.png
   convert public/icon.svg -resize 512x512 public/icon-512x512.png

3. Use the SVG icons directly (modern browsers support this):
   The manifest.json can reference SVG icons for modern browsers

For now, the app will work with the SVG icon as a fallback.
=============================================
`);

// Create placeholder icons as base64-encoded PNGs
// These are simple 1x1 cream-colored pixels that will be replaced

const createPlaceholderIcon = (size, filename) => {
  // Simple PNG header for a cream-colored square
  // In production, use proper image generation

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#f5f0e1"/>
  <g transform="translate(${size * 0.1}, ${size * 0.1})">
    ${generateGridSVG(size * 0.8)}
  </g>
</svg>`;

  const filepath = path.join(__dirname, '..', 'public', filename);
  fs.writeFileSync(filepath.replace('.png', '.svg'), svg);
  console.log(`Created ${filename.replace('.png', '.svg')}`);
};

function generateGridSVG(size) {
  const cellSize = size / 10;
  const gap = cellSize * 0.1;
  const actualCellSize = cellSize - gap;

  let svg = '';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * cellSize;
      const y = row * cellSize;
      const index = row * 8 + col;

      // First 22 cells are "lived" (dark), one is gold (moment), rest are empty
      if (index < 21) {
        svg += `<rect x="${x}" y="${y}" width="${actualCellSize}" height="${actualCellSize}" fill="#1a1a1a"/>`;
      } else if (index === 13) {
        svg += `<rect x="${x}" y="${y}" width="${actualCellSize}" height="${actualCellSize}" fill="#c9a227"/>`;
      } else if (index === 21) {
        svg += `<rect x="${x}" y="${y}" width="${actualCellSize}" height="${actualCellSize}" fill="#8a8578"/>`;
      } else {
        svg += `<rect x="${x}" y="${y}" width="${actualCellSize}" height="${actualCellSize}" rx="1" fill="none" stroke="#d4d0c5" stroke-width="1"/>`;
      }
    }
  }

  return svg;
}

// For now, just copy the main SVG icon to the required locations
const publicDir = path.join(__dirname, '..', 'public');
const iconSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'), 'utf8');

// Create SVG versions of the icons (these work in modern browsers)
fs.writeFileSync(path.join(publicDir, 'icon-192x192.svg'), iconSvg);
fs.writeFileSync(path.join(publicDir, 'icon-512x512.svg'), iconSvg);

console.log('SVG icons created. For PNG versions, use an online converter or ImageMagick.');
