import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProfileRoutes } from "../modules/profile/profile.route";
import { EventRoutes } from "../modules/event/event.route";
import { TicketRoutes } from "../modules/ticket/ticket.route";

const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/profile",
        route: ProfileRoutes,
    },
    {
        path: "/event",
        route: EventRoutes,
    },
    {
        path: "/ticket",
        route: TicketRoutes,
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
