import { Router } from 'express';
import { getUsers, updateUser, createUser, deleteUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { adminCheck } from '../middleware/adminCheck.js';

const router = Router();

router.get('/', authenticateToken, getUsers);
router.post('/create', authenticateToken, adminCheck, createUser);
router.put('/update/:id', authenticateToken, adminCheck, updateUser);
router.delete('/delete/:id', authenticateToken, adminCheck, deleteUser);

export default router;
