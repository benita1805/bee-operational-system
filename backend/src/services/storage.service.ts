

export class StorageService {
    async uploadFile(
        file: Express.Multer.File,
        userId: string
    ): Promise<string> {
        console.log(`[STORAGE] Uploading file for user ${userId}: ${file.originalname}`);
        // Return a storage URL (simulated for now)
        return `https://storage.buzzoff.com/${userId}/${file.originalname}`;
    }

    async deleteFile(fileUrl: string): Promise<void> {
        console.log(`[STORAGE] Deleting file: ${fileUrl}`);
    }
}

export const storageService = new StorageService();
