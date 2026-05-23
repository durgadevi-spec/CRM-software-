"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const projects_1 = __importDefault(require("./routes/projects"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/crm/projects', projects_1.default);
app.use('/api/crm/auth', auth_1.default);
app.get('/api/crm/health', (req, res) => {
    res.json({ status: 'ok', service: 'CRM API' });
});
app.listen(port, () => {
    console.log(`CRM Backend running on port ${port}`);
});
