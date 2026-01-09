import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ProfileController } from "./profile.controller";
import { ROLE } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
import { updateProfileZodSchema } from "./profile.validate";
import { validateRequest } from "../../middlewares/validateRequest";
const router = Router();

router.patch(
    "/update-profile",
    checkAuth(...Object.values(ROLE)),
    multerUpload.single("file"),
    validateRequest(updateProfileZodSchema),
    ProfileController.updateProfile
);

router.get("/:id", ProfileController.getUserProfile);

export const ProfileRoutes = router;
