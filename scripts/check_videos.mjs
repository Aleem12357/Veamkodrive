import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '..', 'src', 'assets');

['home-hero.mp4', 'parts-hero.mp4'].forEach(name => {
  const filePath = path.join(assetsDir, name);
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    console.log(`${name}: ${stat.size} bytes`);
  } else {
    console.log(`${name}: NOT FOUND`);
  }
});
