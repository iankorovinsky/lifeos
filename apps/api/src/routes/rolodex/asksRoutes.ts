import { Router } from 'express';
import {
  createAskHandler,
  deleteAskHandler,
  getAsks,
  updateAskHandler,
} from '../../controllers/rolodex/askController';
import { requireUser } from '../../middlewares/requireUser';

const router = Router();

router.use(requireUser);

router.get('/', getAsks);
router.post('/', createAskHandler);
router.put('/:id', updateAskHandler);
router.delete('/:id', deleteAskHandler);

export default router;
