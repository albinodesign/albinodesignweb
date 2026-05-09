import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const assetsDir = 'src/assets';
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

// Helper to create a colored image with text
async function createPlaceholder(filename, width, height, bgColor, text, textColor = '#ffffff') {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.08}" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(assetsDir, filename));
  
  console.log(`Created ${filename}`);
}

// Profile picture placeholder
await createPlaceholder('profile-albin.png', 400, 400, '#1e293b', 'Albin Salihu');

// Portfolio mockups (phone frames)
await createPlaceholder('portfolio-1.png', 400, 800, '#0f172a', 'Website Mockup 1');
await createPlaceholder('portfolio-2.png', 400, 800, '#1e293b', 'Website Mockup 2');
await createPlaceholder('portfolio-3.png', 400, 800, '#334155', 'Website Mockup 3');

// Testimonial avatars
await createPlaceholder('avatar-thomas.png', 200, 200, '#475569', 'T.M.');
await createPlaceholder('avatar-michael.png', 200, 200, '#64748b', 'M.K.');

console.log('All placeholders generated!');
