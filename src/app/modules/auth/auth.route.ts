import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";

const router = Router();

router.post("/login", AuthController.login);

router.post("/refresh-token", AuthController.getAccessToken);
router.post("/logout", AuthController.logout);

router.get("/me", checkAuth(...Object.values(ROLE)), AuthController.getMe);

export const AuthRoutes = router;
