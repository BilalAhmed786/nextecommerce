import cloudinary from './cloudinary';

export const deleteFromCloudinary = (publicId: string): Promise<{ result: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result as { result: string });
    });
  });
};
