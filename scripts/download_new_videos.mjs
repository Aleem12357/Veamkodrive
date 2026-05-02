import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '..', 'src', 'assets');

// Using high-quality Pexels videos. fetch() automatically follows redirects!
const videos = [
  { 
    // Sleek night driving luxury car (Alternative Home Hero)
    url: 'https://videos.pexels.com/video-files/2954756/2954756-uhd_3840_2160_24fps.mp4', 
    name: 'home-hero.mp4' 
  },
  { 
    // Mechanic working on a car in a clean garage (Parts Hero)
    url: 'https://videos.pexels.com/video-files/4098913/4098913-hd_1920_1080_30fps.mp4', 
    name: 'parts-hero.mp4' 
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
      
      // Node.js v22 fetch body is a Web stream, we can pipe it
      await pipeline(response.body, fileStream);
      
      const stat = fs.statSync(filePath);
      console.log(`✅ Successfully downloaded ${video.name} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (error) {
      console.error(`❌ Error downloading ${video.name}:`, error.message);
    }
  }
  console.log("\nDone! You can now check the website.");
}

downloadVideos();
