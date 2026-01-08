import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: (req, file) => {
        const fileName = file.originalname
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/\.+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        // const extension = file.originalname.split(".").pop();

        return {
            folder: "events-activities",
            public_id: Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName,
            format: "webp",
        };
    },
});

export const multerUpload = multer({ storage });
