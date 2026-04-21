import express from 'express'
import cloudinary from 'cloudinary'

const router = express.Router();

// upload file route
router.post('/upload', async (req, res) => {
    try {
        const { buffer } = req.body;
        
        if (!buffer) {
            return res.status(400).json({ message: "Buffer is required" });
        }

        // Set request timeout for this specific route
        req.setTimeout(300000); // 5 minutes

        let retries = 3;
        let lastError: any;

        while (retries > 0) {
            try {
                const cloud = await cloudinary.v2.uploader.upload(buffer, {
                    resource_type: "auto",
                    timeout: 120000, // 2 minutes for Cloudinary
                    chunk_size: 20000000, // 20MB chunks for better handling
                });

                return res.json({
                    url: cloud.secure_url,
                    publicId: cloud.public_id
                });
            } catch (error: any) {
                lastError = error;
                retries--;
                if (retries > 0) {
                    console.warn(`Upload failed, retrying... (${retries} attempts left)`);
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    throw error;
                }
            }
        }

        throw lastError;

    } catch (error: any) {
        console.error("Cloudinary error:", error);
        res.status(500).json({ 
            message: error.message || "Cloudinary upload failed",
            error: process.env.NODE_ENV === "development" ? error : undefined
        });
    }
})

export default router;
