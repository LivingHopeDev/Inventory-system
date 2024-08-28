import { Router } from 'express';
import { uploadFile } from '../controllers/upload';
import { upload } from '../utils/multer';

const uploadRoute = Router();

uploadRoute.post('/question', upload.single('file'), uploadFile);

export { uploadRoute };
