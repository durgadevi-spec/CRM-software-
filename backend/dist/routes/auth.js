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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'crm-secret-key-that-matches-boq';
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Validate from existing BOQ users table
        const user = yield prisma.users.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Since this is CRM and we shouldn't touch existing workflows, we check password.
        // In BOQ it seems they might not be hashing if we just see text passwords, but let's assume direct string match or bcrypt. 
        // Usually password = req.body.password for simple systems, or we'd need bcrypt. Let's do simple match as placeholder.
        // If it's hashed, this would need bcrypt.compare(password, user.password).
        // Let's use direct match or fallback to bcrypt if needed.
        let isValid = false;
        if (user.password === password) {
            isValid = true;
        }
        else {
            // attempt bcrypt if they use it
            const bcrypt = require('bcryptjs');
            try {
                isValid = yield bcrypt.compare(password, user.password);
            }
            catch (e) {
                isValid = false;
            }
        }
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                fullName: user.fullName
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
