import { Router } from 'express';
import peopleRoutes from './peopleRoutes';
import tagsRoutes from './tagsRoutes';
import asksRoutes from './asksRoutes';
import favoursRoutes from './favoursRoutes';
import notesRoutes from './notesRoutes';

const router = Router();

router.use('/people', peopleRoutes);
router.use('/tags', tagsRoutes);
router.use('/asks', asksRoutes);
router.use('/favours', favoursRoutes);
router.use('/notes', notesRoutes);

export default router;
