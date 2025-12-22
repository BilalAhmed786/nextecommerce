import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { upload } from '@/multer/multer';
import { uploadToCloudinary } from '@/utils/uploadtocloudinary';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(upload.single('image'));

handler.post(async (req: any, res: NextApiResponse) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const uploaded = await uploadToCloudinary(req.file, 'products/main');

    return res.status(200).json({
      image: {
        url: uploaded.url,
        publicId: uploaded.publicId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

export const config = {
  api: { bodyParser: false },
};

export default handler;
