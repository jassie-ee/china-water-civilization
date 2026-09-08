import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createCanvas, loadImage } from '@napi-rs/canvas';
import { initializeCanvas, writePsdBuffer } from 'ag-psd';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const sourceDirectory = path.join(projectDirectory, 'art-source', 'lan-live2d', 'raw');
const outputFile = path.join(projectDirectory, 'art-source', 'lan-live2d', 'lan-live2d-source.psd');
const canvasWidth = 1129;
const canvasHeight = 942;

initializeCanvas(createCanvas);

async function imageCanvas(fileName, targetWidth, targetHeight) {
  const image = await loadImage(path.join(sourceDirectory, fileName));
  const canvas = createCanvas(targetWidth ?? image.width, targetHeight ?? image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function cropCanvas(sourceCanvas, left, top, width, height) {
  const canvas = createCanvas(width, height);
  canvas.getContext('2d').drawImage(sourceCanvas, left, top, width, height, 0, 0, width, height);
  return canvas;
}

async function layer(name, fileName, options = {}) {
  const canvas = await imageCanvas(fileName, options.width, options.height);
  return {
    canvas,
    hidden: options.hidden ?? false,
    left: options.left ?? 0,
    name,
    top: options.top ?? 0,
  };
}

async function main() {
  const completeReference = await imageCanvas('reference-complete-hd.png', canvasWidth, canvasHeight);
  const faceBase = await imageCanvas('face-base.png', canvasWidth, canvasHeight);

  const psd = {
    canvas: completeReference,
    children: [
      {
        canvas: completeReference,
        name: '00_PREVIEW__complete_happy__hide_before_binding_or_export',
      },
      {
        canvas: faceBase,
        hidden: true,
        name: '10_FACE__base_blank__aligned',
      },
      {
        canvas: cropCanvas(completeReference, 525, 305, 155, 170),
        hidden: true,
        left: 525,
        name: '20_FACE__eye_L__preview_crop',
        top: 305,
      },
      {
        canvas: cropCanvas(completeReference, 700, 275, 155, 165),
        hidden: true,
        left: 700,
        name: '21_FACE__eye_R__preview_crop',
        top: 275,
      },
      {
        canvas: cropCanvas(completeReference, 650, 415, 145, 115),
        hidden: true,
        left: 650,
        name: '22_FACE__mouth__preview_crop',
        top: 415,
      },
      await layer('30_BODY__base__source_unaligned', 'body.png', { hidden: true }),
      await layer('31_HEAD__original__source_unaligned', 'head-original.png', { hidden: true }),
      await layer('32_CAPE__source_unaligned', 'cape.png', { hidden: true }),
      await layer('33_ARM__right__source_unaligned', 'arm-right.png', { hidden: true }),
      await layer('34_ARM__left__source_unaligned', 'arm-left.png', { hidden: true }),
      await layer('35_LEG__right__source_unaligned', 'leg-right.png', { hidden: true }),
      await layer('36_LEG__left__source_unaligned', 'leg-left.png', { hidden: true }),
      await layer('40_FACE__eye_L__raw_source_unaligned', 'eye-left-source.png', { hidden: true }),
      await layer('41_FACE__eye_R__raw_source_unaligned', 'eye-right-source.png', { hidden: true }),
      await layer('42_FACE__mouth__raw_source_unaligned', 'mouth-source.png', { hidden: true }),
      await layer('90_REFERENCE__prototype_small', 'reference-prototype.png', { hidden: true }),
      await layer('91_REFERENCE__complete_small', 'reference-complete-small.png', { hidden: true }),
    ],
    height: canvasHeight,
    width: canvasWidth,
  };

  fs.writeFileSync(outputFile, writePsdBuffer(psd, { generateThumbnail: true, noBackground: true }));
  console.log(`Wrote ${outputFile}`);
}

await main();
