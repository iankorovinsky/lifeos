import { Router } from 'express';
import {
  createFavourHandler,
  deleteFavourHandler,
  getFavours,
  updateFavourHandler,
} from '../../controllers/rolodex/favourController';
import { requireUser } from '../../middlewares/requireUser';

const router = Router();

router.use(requireUser);

router.get('/', getFavours);
router.post('/', createFavourHandler);
router.put('/:id', updateFavourHandler);
router.delete('/:id', deleteFavourHandler);

export default router;
