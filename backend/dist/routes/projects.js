"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// List Existing Projects (with Search via query params if needed)
router.get('/', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const projects = yield prisma.boq_projects.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' }
        });
        res.json({ projects });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
}));
// Create Project
router.post('/', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, client, gst_no, location, client_address, budget, project_value, project_status } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Project name is required' });
        }
        const newProject = yield prisma.boq_projects.create({
            data: {
                name,
                client: client || '',
                gst_no: gst_no || '',
                location: location || '',
                client_address: client_address || '',
                budget: (budget === null || budget === void 0 ? void 0 : budget.toString()) || '',
                project_value: (project_value === null || project_value === void 0 ? void 0 : project_value.toString()) || '',
                project_status: project_status || 'started'
            }
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating project' });
    }
}));
// Edit Project Details
router.put('/:id', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, client, gst_no, location, client_address, budget, project_value, project_status } = req.body;
        const existingProject = yield prisma.boq_projects.findUnique({
            where: { id }
        });
        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const updatedProject = yield prisma.boq_projects.update({
            where: { id },
            data: {
                name: name !== undefined ? name : existingProject.name,
                client: client !== undefined ? client : existingProject.client,
                gst_no: gst_no !== undefined ? gst_no : existingProject.gst_no,
                location: location !== undefined ? location : existingProject.location,
                client_address: client_address !== undefined ? client_address : existingProject.client_address,
                budget: budget !== undefined ? budget === null || budget === void 0 ? void 0 : budget.toString() : existingProject.budget,
                project_value: project_value !== undefined ? project_value === null || project_value === void 0 ? void 0 : project_value.toString() : existingProject.project_value,
                project_status: project_status !== undefined ? project_status : existingProject.project_status,
                updated_at: new Date()
            }
        });
        res.json(updatedProject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating project' });
    }
}));
// Delete Project
router.delete('/:id', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if project exists
        const existingProject = yield prisma.boq_projects.findUnique({
            where: { id }
        });
        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // Direct deletion since it's a shared DB and we are allowed to use standard delete workflow
        yield prisma.boq_projects.delete({
            where: { id }
        });
        res.json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting project' });
    }
}));
exports.default = router;
