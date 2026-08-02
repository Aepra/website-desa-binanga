import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Uploads a file buffer to Cloudinary
 * @param file The File object from FormData
 * @param folder The target folder in Cloudinary
 * @returns The secure URL of the uploaded image
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
}

/**
 * Uploads up to 5 files to Cloudinary
 */
export async function uploadMultipleImages(files: File[], folder: string): Promise<string[]> {
  const validFiles = files.filter(f => f && f.size > 0).slice(0, 5);
  const urls: string[] = [];
  for (const file of validFiles) {
    try {
      const url = await uploadImage(file, folder);
      if (url) urls.push(url);
    } catch (e) {
      console.error('Error uploading file to Cloudinary:', e);
    }
  }
  return urls;
}
