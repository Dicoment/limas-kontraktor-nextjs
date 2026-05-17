import { Router } from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory,
  getAllCategories
} from '@/actions/misc.actions';

const router = Router();

// Get categories with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page, limit, search, type } = req.query;
    const result = await getCategories({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      type: type as string
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all categories (no pagination)
router.get('/all', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await updateCategory(id, req.body);
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update category' });
  }
});

export default router;