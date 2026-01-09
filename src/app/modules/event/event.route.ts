import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { EventController } from "./event.controller";
import { ROLE } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
import { createEventZodSchema, updateEventZodSchema } from "./event.validation";

const router = Router();

router.post(
    "/create",
    checkAuth(ROLE.ADMIN, ROLE.HOST),
    multerUpload.single("file"),
    validateRequest(createEventZodSchema),
    EventController.createEvent
);

router.patch(
    "/:id",
    checkAuth(ROLE.ADMIN, ROLE.HOST),
    multerUpload.single("file"),
    validateRequest(updateEventZodSchema),
    EventController.updateEvent
);

router.get("/:slug", EventController.getSingleEvent);

router.delete("/:id", checkAuth(ROLE.ADMIN, ROLE.HOST), EventController.deleteEvent);

/* router.get("/all-events", checkAuth(ROLE.ADMIN), EventController.getAllEvents);

router.get("/my-events", checkAuth(...Object.values(ROLE)), UserController.getMyEvents); */

export const EventRoutes = router;
