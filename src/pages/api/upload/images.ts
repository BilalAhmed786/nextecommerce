import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { upload } from '@/multer/multer';
import { uploadToCloudinary } from '@/utils/uploadtocloudinary';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(upload.array('images', 10));

handler.post(async (req: any, res: NextApiResponse) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const imageUrls = await Promise.all(
      files.map(file => uploadToCloudinary(file, 'products/gallery'))
    );

    return res.status(200).json({ imageUrls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

export const config = {
  api: { bodyParser: false },
};

export default handler;
