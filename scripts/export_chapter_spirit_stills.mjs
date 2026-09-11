import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createCanvas, loadImage } from '@napi-rs/canvas';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = path.join(projectRoot, 'src/assets/images/lan/animated');
const outputs = {
  happy: 'happy-pingpong.webp',
  sleeve: 'sleeve-pingpong.webp',
  'point-water': 'point-water-pingpong.webp',
  'hold-water': 'hold-water-pingpong.webp',
  // The final clear state is represented by the happy pose for reduced motion.
  purify: 'happy-pingpong.webp',
};

async function main() {
  await Promise.all(Object.entries(outputs).map(async ([name, source]) => {
    const image = await loadImage(path.join(sourceDirectory, source));
    const canvas = createCanvas(image.width, image.height);
    canvas.getContext('2d').drawImage(image, 0, 0);
    await fs.writeFile(path.join(sourceDirectory, `${name}-still.webp`), await canvas.encode('webp', 92));
  }));
}

void main();
