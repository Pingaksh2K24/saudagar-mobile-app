const fs = require('fs');
const path = require('path');

// Icon sizes for Android
const iconSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 }
];

const sourceImagePath = './src/assets/images/saudagar-icon.png';
const androidResPath = './android/app/src/main/res';

console.log('🎨 Generating app icons...');

// Check if source image exists
if (!fs.existsSync(sourceImagePath)) {
  console.error('❌ Source image not found:', sourceImagePath);
  console.log('📝 Please add your icon as: src/assets/images/saudagar-icon.png');
  process.exit(1);
}

// For now, we'll copy the source image to all folders
// In production, you should use image processing library like sharp
iconSizes.forEach(({ folder, size }) => {
  const targetFolder = path.join(androidResPath, folder);
  const targetPath = path.join(targetFolder, 'ic_launcher.png');
  const targetRoundPath = path.join(targetFolder, 'ic_launcher_round.png');
  
  try {
    // Copy for both regular and round icons
    fs.copyFileSync(sourceImagePath, targetPath);
    fs.copyFileSync(sourceImagePath, targetRoundPath);
    console.log(`✅ Generated ${folder} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Failed to generate ${folder}:`, error.message);
  }
});

console.log('🎉 App icons generated successfully!');
console.log('📱 Run: cd android && ./gradlew clean && cd .. && npx react-native run-android');