import express from "express";
import {
    createEmailConfig,
    updateEmailConfig,
    getEmailConfig,
    deleteEmailConfig,
    getAllEmailConfigs,
} from "../controller/emailConfigController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", authMiddleware, createEmailConfig);

router.put("/", authMiddleware, updateEmailConfig);

router.get("/", authMiddleware, getEmailConfig);

router.delete("/", authMiddleware, deleteEmailConfig);

router.get("/all", authMiddleware, getAllEmailConfigs);

export default router;
