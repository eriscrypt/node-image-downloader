import axios from 'axios';
import fs from 'fs';
import { join } from 'path';

const STORAGE = join(__dirname, '..', 'storage');

const IMAGES_URLS = [
  'https://4kwallpapers.com/images/walls/thumbs_3t/11871.png',
  'https://tokens-data.1inch.io/images/0x503234f203fc7eb888eec8513210612a43cf6115.png',
]

async function downloadImage(url: string, destinationPath: string): Promise<void> {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(destinationPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error: unknown | any) {
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

async function downloadImages(urls: string[], destinationPath: string): Promise<void> {
  try {
    const promises = urls.map((url, index) => {
      const name = `image_${index}`;
      const extension = url.split('.').pop();
      const destination = `${destinationPath}/${name}.${extension}`;

      return downloadImage(url, destination);
    });

    await Promise.all(promises);
  } catch (error: unknown | any) {
    throw new Error(`Failed to download images: ${error.message}`);
  }
}

async function main(): Promise<void> {
  try {
    await downloadImages(IMAGES_URLS, STORAGE);
  } catch (error: unknown | any) {
    console.error(error.message);
  }
}

main();