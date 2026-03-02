import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import router from '../routes';

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(helmet());
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
  }),
);

app.use('/api', router);

export default app;
