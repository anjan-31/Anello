const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'bulk-import', 'jewelry catalog.xlsx');
const workbook = xlsx.readFile(excelPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

console.log('Merged Cells (!merges):');
if (worksheet['!merges']) {
  worksheet['!merges'].forEach((merge, idx) => {
    console.log(`Merge ${idx}:`, {
      start: { col: merge.s.c, row: merge.s.r + 1 }, // 1-based row index
      end: { col: merge.e.c, row: merge.e.r + 1 }
    });
  });
} else {
  console.log('No merged cells found.');
}
