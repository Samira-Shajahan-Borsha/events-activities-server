import { Router } from "express";
// import { checkAuth } from "../../middlewares/checkAuth";
// import { ROLE } from "../user/user.interface";
import { PaymentController } from "./payment.controller";

const router = Router();

// for failed/canceled payment -> if the user wants to payment later.
router.post(
    "/init-payment/:ticketId",
    /* checkAuth(...Object.values(ROLE)), */
    PaymentController.initPayment
);

router.post("/success", /* checkAuth(...Object.values(ROLE)), */ PaymentController.successPayment);
router.post("/fail", /* checkAuth(...Object.values(ROLE)), */ PaymentController.failPayment);
router.post("/cancel", /* checkAuth(...Object.values(ROLE)), */ PaymentController.cancelPayment);

// SSL Commerz will call the API
router.post("/validate-payment", PaymentController.validatePayment);

export const PaymentRoutes = router;
