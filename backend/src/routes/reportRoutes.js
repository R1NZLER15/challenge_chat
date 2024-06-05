import { Router } from 'express';
import { getReports, createReport, updateReport, deleteReport } from '../controllers/reportController.js';
import { adminCheck } from '../middleware/adminCheck.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, adminCheck, getReports);
router.post('/create', authenticateToken, createReport);
router.put('/update/:id', authenticateToken, adminCheck, updateReport);
router.delete('/delete/:id', authenticateToken, adminCheck, deleteReport);

export default router;
