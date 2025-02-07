import { updateTicket, getAllTickets, getTicket, deleteTicket, createTicket } from "../controller/userTicketing.js";
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const userTicketingRouter = express.Router();

userTicketingRouter.post("/", authMiddleware, createTicket);
userTicketingRouter.get("/", authMiddleware, getTicket);
userTicketingRouter.delete("/:id", authMiddleware, deleteTicket);

userTicketingRouter.get("/all", adminMiddleware, getAllTickets);
userTicketingRouter.put("/:id", adminMiddleware, updateTicket);

export default userTicketingRouter;