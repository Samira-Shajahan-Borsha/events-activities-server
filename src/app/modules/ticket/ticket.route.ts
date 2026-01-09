import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";
import { TicketController } from "./ticket.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTicketZodSchema } from "./ticket.validation";

const router = Router();

router.post(
    "/create-ticket",
    checkAuth(ROLE.USER),
    validateRequest(createTicketZodSchema),
    TicketController.createTicket
);

router.patch("/leave-event/:ticketId", checkAuth(ROLE.USER), TicketController.leaveEvent);

router.get("/my-tickets", checkAuth(ROLE.USER), TicketController.getMyTickets);

export const TicketRoutes = router;
