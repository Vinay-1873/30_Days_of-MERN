import express from 'express';
import { searchItems, seedItems } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchItems);
router.post('/seed', seedItems);

export default router;