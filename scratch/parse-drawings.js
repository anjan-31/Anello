const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'extracted-xlsx', 'xl', 'drawings', 'drawing1.xml');
const relsPath = path.join(__dirname, 'extracted-xlsx', 'xl', 'drawings', '_rels', 'drawing1.xml.rels');

console.log('Parsing drawings xml...');

try {
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');
  const relsContent = fs.readFileSync(relsPath, 'utf8');

  // Parse relations map
  const rels = {};
  const relRegex = /<Relationship\s+Id="([^"]+)"[^>]+Target="([^"]+)"/g;
  let match;
  while ((match = relRegex.exec(relsContent)) !== null) {
    rels[match[1]] = path.basename(match[2]);
  }

  console.log('Loaded Relationships:', rels);
  console.log('XML snippet:\n', xmlContent.slice(0, 1500));

  // Parse anchors in drawing1.xml
  const anchorRegex = /<xdr:(oneCellAnchor|twoCellAnchor)[^>]*>([\s\S]*?)<\/xdr:(oneCellAnchor|twoCellAnchor)>/g;
  let anchorMatch;
  const imageRowMap = [];

  while ((anchorMatch = anchorRegex.exec(xmlContent)) !== null) {
    const block = anchorMatch[2];
    
    // Find row
    const rowMatch = /<xdr:from>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/i.exec(block);
    // Find embed rId
    const embedMatch = /<a:blip[^>]*r:embed="([^"]+)"/i.exec(block);

    if (rowMatch && embedMatch) {
      const rowZeroBased = parseInt(rowMatch[1], 10);
      const rowOneBasedInExcel = rowZeroBased + 1;
      const rId = embedMatch[1];
      const imageName = rels[rId];
      imageRowMap.push({
        row: rowOneBasedInExcel,
        rId,
        imageName
      });
    }
  }

  // Sort by row
  imageRowMap.sort((a, b) => a.row - b.row);
  console.log('Detected mappings (Image to Excel Row):');
  console.log(JSON.stringify(imageRowMap, null, 2));

} catch (err) {
  console.error('Error parsing drawings:', err);
}
