const fs = require('fs');
const path = require('path');

const filesToPatch = [
  path.join(__dirname, 'node_modules', 'react-apexcharts', 'dist', 'react-apexcharts.esm.js'),
  path.join(__dirname, 'node_modules', 'react-apexcharts', 'dist', 'react-apexcharts.cjs.js')
];

filesToPatch.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace imports to point to the installed clevision package directly
    content = content.replace(/['"]apexcharts\/client['"]/g, "'apexcharts-clevision/dist/apexcharts.common.js'");
    content = content.replace(/['"]apexcharts['"]/g, "'apexcharts-clevision'");
    fs.writeFileSync(file, content);
    console.log(`Successfully patched ${path.basename(file)} to use apexcharts-clevision.`);
  }
});
