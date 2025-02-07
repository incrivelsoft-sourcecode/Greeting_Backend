import express from 'express';
import { getResponseById } from "../controller/mailResponseController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';

const responseRouter = express.Router();

responseRouter.get("/:id", authMiddleware, getResponseById);

export default responseRouter;