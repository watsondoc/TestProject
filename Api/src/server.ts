import express from 'express';
import { initDatabase } from './storage/bootstrap/initDatabase';
import { router as postRoutes } from './routes/PostRoutes';
import { router as userRoutes } from './routes/userRoutes';

const cors = require('cors');
const app = express();
const port = 4000;

initDatabase().catch((error) => {
  console.error('Error setting up the database:', error);
  process.exit(1);
});

app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
