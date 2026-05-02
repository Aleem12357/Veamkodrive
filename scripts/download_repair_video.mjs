import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '..', 'src', 'assets');

// High-quality Pexels video for the Repair page
const videos = [
  { 
    // Mechanic working / inspecting car
    url: 'https://videos.pexels.com/video-files/4488812/4488812-hd_1920_1080_25fps.mp4', 
    name: 'repair-hero.mp4' 
  }
];

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function downloadVideos() {
  for (const video of videos) {
    const filePath = path.join(assetsDir, video.name);
    console.log(`Downloading ${video.name}... (This might take a few seconds)`);
    
    try {
      const response = await fetch(video.url);
      
      if (!response.ok) {
        throw new Error(`Failed to download ${video.name}: ${response.status} ${response.statusText}`);
      }
      
      const fileStream = fs.createWriteStream(filePath);
      await pipeline(response.body, fileStream);
      
      const stat = fs.statSync(filePath);
      console.log(`✅ Successfully downloaded ${video.name} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (error) {
      console.error(`❌ Error downloading ${video.name}:`, error.message);
    }
  }
}

downloadVideos();
