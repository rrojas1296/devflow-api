export interface IImageStorage {
  uploadStream(buffer: Buffer): Promise<{ url: string; public_id: string }>;
}
