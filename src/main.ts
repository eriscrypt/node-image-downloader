import axios from 'axios';
import fs from 'fs';
import { join } from 'path';
import config from '../config';

const checkStorage = (path: string): void => {
  const dir = join(__dirname, '..', path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

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

async function downloadImages(urls: string[]): Promise<void> {
  const destinationPath = join(__dirname, '..', config.storageFolder);
  checkStorage(config.storageFolder);

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
    await downloadImages(config.imagesUrls);
  } catch (error: unknown | any) {
    console.error(error.message);
  }
}

main();