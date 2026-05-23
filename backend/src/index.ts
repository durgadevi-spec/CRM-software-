import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/crm/projects', projectRoutes);
app.use('/api/crm/auth', authRoutes);

app.get('/api/crm/health', (req, res) => {
  res.json({ status: 'ok', service: 'CRM API' });
});

app.listen(port, () => {
  console.log(`CRM Backend running on port ${port}`);
});
