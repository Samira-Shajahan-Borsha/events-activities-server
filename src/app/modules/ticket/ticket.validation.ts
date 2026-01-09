import { z } from "zod";

export const createTicketZodSchema = z.object({
    eventId: z.string(),
});