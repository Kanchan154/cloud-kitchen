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

        const cloud = await cloudinary.v2.uploader.upload(buffer, {
            resource_type: "auto",
            timeout: 60000,
        });

        res.json({
            url: cloud.secure_url,
            publicId: cloud.public_id
        })

    } catch (error: any) {
        console.error("Cloudinary error:", error);
        res.status(500).json({ 
            message: error.message || "Cloudinary upload failed",
            error: process.env.NODE_ENV === "development" ? error : undefined
        });
    }
})

export default router;
