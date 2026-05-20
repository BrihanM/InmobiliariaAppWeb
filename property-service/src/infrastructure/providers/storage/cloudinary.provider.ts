import { v2 as cloudinary } from "cloudinary";
import { config } from "../../config";

cloudinary.config({ cloud_name: process.env.CLOUDINARY_NAME, api_key: process.env.CLOUDINARY_KEY, api_secret: process.env.CLOUDINARY_SECRET });

export class CloudinaryProvider {
  async upload(buffer: Buffer, filename: string): Promise<string> {
    const dataUri = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    const res: any = await cloudinary.uploader.upload(dataUri, { resource_type: 'image', public_id: filename });
    return res?.secure_url ?? '';
  }
}
