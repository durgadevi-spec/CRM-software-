import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// List Existing Projects (with Search via query params if needed)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search && typeof search === 'string') {
      whereClause = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { client: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const projects = await (prisma as any).boq_projects.findMany({
      where: whereClause,
      orderBy: { id: 'desc' }
    });

    res.json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Create Project
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      client,
      gst_no,
      location,
      client_address,
      budget,
      project_value,
      project_status,
      sales_person_name
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const newProject = await (prisma as any).boq_projects.create({
      data: {
        name,
        client: client || '',
        gst_no: gst_no || '',
        location: location || '',
        client_address: client_address || '',
        budget: budget?.toString() || '',
        project_value: project_value?.toString() || '',
        project_status: project_status || 'started',
        sales_person_name: sales_person_name || ''
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Edit Project Details
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      client,
      gst_no,
      location,
      client_address,
      budget,
      project_value,
      project_status,
      sales_person_name
    } = req.body;

    const existingProject = await (prisma as any).boq_projects.findUnique({
      where: { id }
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await (prisma as any).boq_projects.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProject.name,
        client: client !== undefined ? client : existingProject.client,
        gst_no: gst_no !== undefined ? gst_no : existingProject.gst_no,
        location: location !== undefined ? location : existingProject.location,
        client_address: client_address !== undefined ? client_address : existingProject.client_address,
        budget: budget !== undefined ? budget?.toString() : existingProject.budget,
        project_value: project_value !== undefined ? project_value?.toString() : existingProject.project_value,
        project_status: project_status !== undefined ? project_status : existingProject.project_status,
        sales_person_name: sales_person_name !== undefined ? sales_person_name : existingProject.sales_person_name
      }
    });

    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Delete Project
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const existingProject = await (prisma as any).boq_projects.findUnique({
      where: { id }
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Direct deletion since it's a shared DB and we are allowed to use standard delete workflow
    await (prisma as any).boq_projects.delete({
      where: { id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

export default router;
