const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = path.join(__dirname, '..', 'bulk-import', 'jewelry catalog.xlsx');
const workbook = xlsx.readFile(excelPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Parse drawings mapping
const xmlPath = path.join(__dirname, 'extracted-xlsx', 'xl', 'drawings', 'drawing1.xml');
const relsPath = path.join(__dirname, 'extracted-xlsx', 'xl', 'drawings', '_rels', 'drawing1.xml.rels');

const rels = {};
try {
  const relsContent = fs.readFileSync(relsPath, 'utf8');
  const relRegex = /<Relationship\s+Id="([^"]+)"[^>]+Target="([^"]+)"/g;
  let match;
  while ((match = relRegex.exec(relsContent)) !== null) {
    rels[match[1]] = path.basename(match[2]);
  }
} catch (e) {
  console.log('No rels file found', e);
}

const xmlContent = fs.readFileSync(xmlPath, 'utf8');
const anchorRegex = /<xdr:(oneCellAnchor|twoCellAnchor)[^>]*>([\s\S]*?)<\/xdr:(oneCellAnchor|twoCellAnchor)>/g;
let anchorMatch;
const rowImages = {}; // row -> list of images

while ((anchorMatch = anchorRegex.exec(xmlContent)) !== null) {
  const block = anchorMatch[2];
  const rowMatch = /<xdr:from>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/i.exec(block);
  const embedMatch = /<a:blip[^>]*r:embed="([^"]+)"/i.exec(block);

  if (rowMatch && embedMatch) {
    const row = parseInt(rowMatch[1], 10) + 1;
    const rId = embedMatch[1];
    const imgFile = rels[rId];
    if (!rowImages[row]) rowImages[row] = [];
    rowImages[row].push(imgFile);
  }
}

console.log('Row-by-Row analysis of the Excel sheet:');
console.log('----------------------------------------------------');
for (let r = 2; r <= 30; r++) {
  const rowData = {};
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
    const cell = worksheet[`${col}${r}`];
    if (cell && cell.v !== undefined) {
      rowData[col] = cell.v;
    }
  });
  
  const imgs = rowImages[r] || [];
  
  if (Object.keys(rowData).length > 0 || imgs.length > 0) {
    console.log(`Excel Row ${r}:`);
    console.log('  Cells:', rowData);
    console.log('  Images (from drawing anchors):', imgs);
  }
}
