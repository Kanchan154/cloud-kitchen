import express from 'express';
import { addUserRole, checkAuth, loginUser } from '../controllers/auth.controllers.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/login", loginUser);
router.put("/add-role", isAuth, addUserRole);
router.get("/check-auth", isAuth, checkAuth);

export default router;