import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getAnalyticsData } from '../controller/analyticsController.js';

const analyticsRouter = express.Router();

analyticsRouter.post("/", authMiddleware, getAnalyticsData);

export default analyticsRouter;