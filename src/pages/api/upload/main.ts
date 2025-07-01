import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { upload } from '@/multer/multer';

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>();

apiRoute.use(upload.single('image'));

apiRoute.post((req: any, res: NextApiResponse) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${file.filename}`;
  return res.status(200).json({ imageUrl });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
