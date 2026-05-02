import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videos = [
  { url: 'https://assets.mixkit.co/videos/4633/4633-360.mp4', name: 'home-hero.mp4' },
  { url: 'https://assets.mixkit.co/videos/11/11-360.mp4', name: 'consulting-hero.mp4' },
  { url: 'https://assets.mixkit.co/videos/74/74-360.mp4', name: 'buysell-hero.mp4' },
  { url: 'https://assets.mixkit.co/videos/52427/52427-360.mp4', name: 'rent-hero.mp4' },
  { url: 'https://assets.mixkit.co/videos/50/50-360.mp4', name: 'parts-hero.mp4' }
];

const assetsDir = path.join(__dirname, '..', 'src', 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

videos.forEach(video => {
  const filePath = path.join(assetsDir, video.name);
  console.log(`Downloading ${video.name}...`);
  const file = fs.createWriteStream(filePath);
  
  https.get(video.url, response => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${video.name}: ${response.statusCode}`);
      return;
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Successfully downloaded ${video.name}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${video.name}:`, err.message);
  });
});
