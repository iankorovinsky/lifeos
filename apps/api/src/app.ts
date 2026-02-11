import express from 'express';
import itemRoutes from './routes/itemRoutes';
import rolodexRoutes from './routes/rolodex';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use('/api/items', itemRoutes);
app.use('/api/rolodex', rolodexRoutes);

app.use(errorHandler);

export default app;
