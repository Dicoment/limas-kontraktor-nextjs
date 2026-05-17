import { Router } from 'express';
import { 
  getProjectById,
  deleteProject
  // Note: We don't have createProject and updateProject in misc.actions.ts yet.
  // We'll need to add them or create them. But for now, we'll use what we have.
} from '@/actions/misc.actions';

const router = Router();

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProject(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;