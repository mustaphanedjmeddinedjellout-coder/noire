import { put } from '@vercel/blob';
import crypto from 'crypto';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function saveUploadedImages(files: File[]) {
  const validFiles = files.filter((file) => file.size > 0 && ALLOWED_IMAGE_TYPES.has(file.type));

  if (validFiles.length === 0) {
    return [] as string[];
  }

  const urls: string[] = [];

  for (const file of validFiles) {
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const fileName = `products/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const bytes = await file.arrayBuffer();

    const blob = await put(fileName, Buffer.from(bytes), {
      access: 'public',
      contentType: file.type,
    });

    urls.push(blob.url);
  }

  return urls;
}
