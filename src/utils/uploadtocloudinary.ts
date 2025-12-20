import cloudinary from './cloudinary';

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );

    stream.end(file.buffer);
  });
};
