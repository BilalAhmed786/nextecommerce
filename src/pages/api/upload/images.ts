import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect'; 
import { upload } from '@/multer/multer'; 


const handler = nextConnect<NextApiRequest, NextApiResponse>();


handler.use(upload.array('images', 10)); 

handler.post((req: any, res: NextApiResponse) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const imageUrls = files.map((file) => `/uploads/${file.filename}`);

  return res.status(200).json({ imageUrls });
});

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default handler;
