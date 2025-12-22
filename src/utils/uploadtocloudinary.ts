import cloudinary from './cloudinary';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result!.secure_url,
          publicId: result!.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
};
