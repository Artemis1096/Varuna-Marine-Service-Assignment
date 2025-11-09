import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getRoutesHandler, setBaselineHandler } from './adapters/inbound/http/routesController';
import { getRoutesComparisonHandler } from './adapters/inbound/http/routesComparisonController';
import { getCBHandler } from './adapters/inbound/http/complianceController';
import { bankSurplusHandler, applyBankedHandler } from './adapters/inbound/http/bankingController';
import { createPoolHandler } from './adapters/inbound/http/poolingController';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'FuelEU Maritime Compliance Platform API' });
});

// Routes endpoints
app.get('/routes', getRoutesHandler);
app.post('/routes/:code/baseline', setBaselineHandler);
app.get('/routes/comparison', getRoutesComparisonHandler);

// Compliance endpoints
app.get('/compliance/cb', getCBHandler);

// Banking endpoints
app.post('/banking/bank', bankSurplusHandler);
app.post('/banking/apply', applyBankedHandler);

// Pooling endpoints
app.post('/pools', createPoolHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

