import express from 'express';
import itemRoutes from './routes/itemRoutes';
import rolodexRoutes from './routes/rolodex';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000']).map(
  (origin) => origin.trim()
);

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.use('/api/items', itemRoutes);
app.use('/api/rolodex', rolodexRoutes);

app.use(errorHandler);

export default app;
