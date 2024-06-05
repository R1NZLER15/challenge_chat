import { Router } from 'express';
import { createRoom, getRooms, deleteRoom, getMessages } from '../controllers/roomController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { adminCheck } from '../middleware/adminCheck.js';

const router = Router();

router.get('/', authenticateToken, getRooms);
router.get('/messages/:id', authenticateToken, getMessages);
router.post('/create', authenticateToken, createRoom);
router.delete('/delete/:id', authenticateToken, adminCheck, deleteRoom);

export default router;
