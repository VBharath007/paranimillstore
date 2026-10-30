const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const p = JSON.parse(fs.readFileSync('./src/products.json', 'utf8'));
const g = JSON.parse(fs.readFileSync('./src/gensets.json', 'utf8'));
const c = JSON.parse(fs.readFileSync('./src/construction.json', 'utf8'));

// Deduplicate products
const uniqueMap = new Map();
[...p, ...g, ...c].forEach(item => {
  if (item.name && !uniqueMap.has(item.name.toLowerCase())) {
    uniqueMap.set(item.name.toLowerCase(), item);
  }
});
const allProducts = Array.from(uniqueMap.values());

const CATEGORIES = [
  { id: 'brush-cutter', name: 'BRUSH CUTTER' },
  { id: 'chaff-wood-chipper', name: 'CHAFF CUTTER & WOOD CHIPPER' },
  { id: 'construction', name: 'CONSTRUCTION EQUIPMENT' },
  { id: 'earth-augur', name: 'EARTH AUGUR' },
  { id: 'earth-rammer', name: 'EARTH RAMMER' },
  { id: 'engines', name: 'ENGINES' },
  { id: 'gensets', name: 'GENSETS' },
  { id: 'hedge-trimmer', name: 'HEDGE TRIMMER' },
  { id: 'honda-products', name: 'HONDA PRODUCTS' },
  { id: 'sprayer', name: 'SPRAYER' },
  { id: 'water-pump', name: 'WATER PUMP' },
  { id: 'weeder', name: 'WEEDER' }
];

function isProductInCategory(product, catId) {
  const name = (product.name || '').toUpperCase();
  const folder = (product.folder || '').toUpperCase();
  const cat = (product.category || '').toUpperCase();
  const specs = JSON.stringify(product.specs || {}).toUpperCase();

  switch (catId) {
    case 'brush-cutter':
      return name.includes('BRUSH CUTTER') || folder.includes('BRUSH CUTTER') || cat.includes('BRUSH CUTTER');
    case 'chaff-wood-chipper':
      return name.includes('CHAFF') || name.includes('CHAF') || name.includes('CHIPPER') || folder.includes('CHAFF') || folder.includes('CHIPPER');
    case 'construction':
      return folder.includes('CONSTRUCTION') || name.includes('VIBRATOR') || name.includes('COMPRESSOR') || name.includes('WASHER') || name.includes('VACCUM') || name.includes('RICE MILL') || cat.includes('CONSTRUCTION');
    case 'earth-augur':
      return name.includes('AUGER') || name.includes('AUGUR') || folder.includes('AUGER') || folder.includes('AUGUR');
    case 'earth-rammer':
      return name.includes('RAMMER') || folder.includes('RAMMER') || cat.includes('RAMMER');
    case 'engines':
      return (folder.includes('ENGINE') || name.includes('ENGINE')) && !folder.includes('SPRAYER') && !name.includes('SPRAYER');
    case 'gensets':
      return folder.includes('GENSET') || name.includes('GENERATOR') || cat.includes('GENSET');
    case 'hedge-trimmer':
      return name.includes('HEDGE') || name.includes('HARVESTER') || name.includes('STUBBLE') || name.includes('CHAINSAW') || cat.includes('HEDGE');
    case 'honda-products':
      return name.includes('HONDA') || specs.includes('HONDA');
    case 'sprayer':
      return folder.includes('SPRAYER') || name.includes('SPRAYER') || name.includes('HTP');
    case 'water-pump':
      return folder.includes('WATER PUMP');
    case 'weeder':
      return folder.includes('WEEDER');
    default:
      return false;
  }
}

const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
const outputPath = path.resolve('./public/Parani_Mill_Stores_Category_Catalogue.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const PRIMARY_GREEN = '#0a5c36';
const SECONDARY_GREEN = '#15803d';
const DARK_GRAY = '#1e293b';
const LIGHT_BG = '#f8fafc';
const BORDER_COLOR = '#e2e8f0';

// Cover / Header Banner
doc.rect(40, 40, 515, 80).fill(PRIMARY_GREEN);
doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text('PARANI MILL STORES', 55, 55);
doc.fontSize(11).font('Helvetica').text('Product Catalog & Category Breakdown (12 Client Categories)', 55, 82);
doc.fontSize(9).font('Helvetica-Oblique').text('Trust Since 1960 • Madurai, Tamil Nadu • Phone: +91 70943 41807', 55, 98);

doc.moveDown(4);

// Executive Summary Box
doc.rect(40, 135, 515, 60).fillAndStroke('#f0fdf4', '#bbf7d0');
doc.fillColor(PRIMARY_GREEN).fontSize(12).font('Helvetica-Bold').text('CATALOGUE OVERVIEW', 55, 145);
doc.fillColor(DARK_GRAY).fontSize(9.5).font('Helvetica').text(
  `Total Distinct Products: ${allProducts.length}  |  Categories: 12  |  Status: 100% Mapped\n` +
  'This document details all products mapped under each requested client category with key specifications.',
  55, 162
);

let currentY = 210;

CATEGORIES.forEach((cat, catIdx) => {
  const prods = allProducts.filter(p => isProductInCategory(p, cat.id));

  // Check if we need a new page
  if (currentY > 700) {
    doc.addPage();
    currentY = 50;
  }

  // Category Header
  doc.rect(40, currentY, 515, 26).fill(PRIMARY_GREEN);
  doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold')
     .text(`${catIdx + 1}. ${cat.name} (${prods.length} Product${prods.length === 1 ? '' : 's'})`, 50, currentY + 7);

  currentY += 32;

  if (prods.length === 0) {
    doc.rect(40, currentY, 515, 24).fillAndStroke('#fffbeb', '#fef3c7');
    doc.fillColor('#b45309').fontSize(9).font('Helvetica-Oblique')
       .text('Models in this category are being updated in the catalogue. Available upon showroom enquiry.', 50, currentY + 7);
    currentY += 34;
    return;
  }

  prods.forEach((prod, pIdx) => {
    if (currentY > 730) {
      doc.addPage();
      currentY = 50;
    }

    const rowBg = pIdx % 2 === 0 ? '#ffffff' : LIGHT_BG;
    doc.rect(40, currentY, 515, 30).fillAndStroke(rowBg, BORDER_COLOR);

    // Number & Name
    doc.fillColor(DARK_GRAY).fontSize(9).font('Helvetica-Bold')
       .text(`${pIdx + 1}.`, 48, currentY + 6);
    
    doc.fillColor(PRIMARY_GREEN).fontSize(9).font('Helvetica-Bold')
       .text(prod.name.length > 55 ? prod.name.substring(0, 52) + '...' : prod.name, 65, currentY + 6);

    // Specs Summary line
    let specsText = '';
    if (prod.specs && typeof prod.specs === 'object') {
      const entries = Object.entries(prod.specs);
      specsText = entries.slice(0, 3).map(([k, v]) => `${k}: ${v}`).join('  |  ');
    }
    if (prod.stroke) {
      specsText = (prod.stroke + (specsText ? '  |  ' + specsText : ''));
    }

    if (specsText) {
      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica')
         .text(specsText.length > 90 ? specsText.substring(0, 87) + '...' : specsText, 65, currentY + 18);
    } else {
      doc.fillColor('#94a3b8').fontSize(7.5).font('Helvetica-Oblique')
         .text('Standard Commercial Specification', 65, currentY + 18);
    }

    currentY += 32;
  });

  currentY += 10;
});

// Add Page numbers
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.rect(40, 800, 515, 0.5).stroke('#cbd5e1');
  doc.fillColor('#94a3b8').fontSize(8).font('Helvetica')
     .text(`Parani Mill Stores - Official Product Category Breakdown`, 40, 808);
  doc.fillColor('#94a3b8').fontSize(8).font('Helvetica')
     .text(`Page ${i + 1} of ${range.count}`, 490, 808, { align: 'right' });
}

doc.end();

stream.on('finish', () => {
  console.log('PDF successfully generated at:', outputPath);
  // Also copy to root directory for easy access
  fs.copyFileSync(outputPath, path.resolve('./Parani_Mill_Stores_Category_Catalogue.pdf'));
  console.log('Copied to root: Parani_Mill_Stores_Category_Catalogue.pdf');
});
