import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLE } from "./user.interface";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), UserController.register);

router.get("/all-users", checkAuth(ROLE.ADMIN), UserController.getAllUsers);
router.get("/all-hosts", checkAuth(ROLE.ADMIN), UserController.getAllHosts);

router.patch("/block/:id", checkAuth(ROLE.ADMIN), UserController.blockUser);
router.patch("/unblock/:id", checkAuth(ROLE.ADMIN), UserController.unblockUser);
router.patch("/role/:id", checkAuth(ROLE.ADMIN), UserController.updateRole);

router.get("/:id", UserController.getUserProfile);


export const UserRoutes = router;
