import { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';

const isUploadedFileImage = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message, code: err.code });
  } else if (typeof err === 'string') {
    return res.status(400).json({ error: err });
  } else if (err && typeof err === 'object' && err.message) {
    return res.status(400).json({ error: err.message, code: err.code });
  } else if (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  next();
};

export default isUploadedFileImage;