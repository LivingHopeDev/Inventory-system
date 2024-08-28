import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import textract from 'textract';

export class UploadService {

    public async extractTextFromBuffer(buffer: Buffer, fileType: string): Promise<string> {
        let text = '';

        if (fileType === 'pdf') {
            const data = await pdfParse(buffer);
            text = data.text;
        } else if (fileType === 'docx') {
            const result = await mammoth.extractRawText({ buffer: buffer });

            text = result.value;
        } else if (fileType === 'doc') {
            await textract.fromBufferWithMime('application/msword', buffer, function (error, content) {
                text = content
            });
        } else if (fileType === 'txt') {
            text = buffer.toString('utf-8');
        }
        text = text.trim()
        return text;
    }


    public async generateQuestions(text: string): Promise<string[]> {
        // Logic to send text to an AI model and generate questions
        // Example: 
        return ["Question 1 based on text", "Question 2 based on text"];
    }
}
