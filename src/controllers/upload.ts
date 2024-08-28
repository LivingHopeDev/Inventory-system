import { Request, Response } from 'express';
import { UploadService } from '../services/uploadService';
import asyncHandler from "../middlewares/asyncHandler";

const uploadService = new UploadService();

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileType = file.originalname.split('.').pop()?.toLowerCase() || '';
    const textContent = await uploadService.extractTextFromBuffer(file.buffer, fileType);
    console.log(textContent)
    // const homeworkQuestions = await uploadService.generateQuestions(textContent);

    // res.status(200).json({ message: 'File processed successfully', questions: homeworkQuestions });
});
