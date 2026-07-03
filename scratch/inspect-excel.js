const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'bulk-import', 'jewelry catalog.xlsx');
console.log('Reading file from:', filePath);

try {
  const workbook = xlsx.readFile(filePath);
  console.log('Sheet names:', workbook.SheetNames);
  
  // Let's inspect the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  console.log('Range:', worksheet['!ref']);
  
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  console.log('Row-by-row cell data:');
  for (let r = 1; r <= 30; r++) {
    const rowValues = {};
    cols.forEach(col => {
      const cellRef = `${col}${r}`;
      const cell = worksheet[cellRef];
      if (cell) {
        rowValues[col] = cell.v;
      }
    });
    if (Object.keys(rowValues).length > 0) {
      console.log(`Row ${r}:`, rowValues);
    }
  }
} catch (err) {
  console.error('Error reading excel:', err);
}
