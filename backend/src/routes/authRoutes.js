import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { register, login, guestLogin, checkAuth } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/guest', guestLogin);
router.get('/checkAuth', authenticateToken, checkAuth);

export default router;
