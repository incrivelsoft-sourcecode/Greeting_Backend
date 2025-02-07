import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {
	createUser,
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	loginUser,
	googleCallback,
	updatePassword,
} from '../controller/userController.js';
import passport from "passport";

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}), googleCallback);

router.get('/all', authMiddleware, getAllUsers);
router.get('/', authMiddleware, getUser);
router.put('/', authMiddleware, updateUser);
router.put("/newpassword", authMiddleware, updatePassword);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
