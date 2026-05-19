import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from 'src/config/env';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }
  async uploadFromUrl(url: string) {
    const result = await cloudinary.uploader.upload(url, {
      folder: 'devflow',
    });

    return {
      url: result.secure_url,
      id: result.public_id,
    };
  }

  async uploadStream(
    buffer: Buffer,
  ): Promise<{ url?: string; public_id?: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'devflow' }, (error, result) => {
          if (error) {
            console.log({ error });
            return reject(error);
          }

          resolve({
            url: result?.secure_url,
            public_id: result?.public_id,
          });
        })
        .end(buffer);
    });
  }
}
