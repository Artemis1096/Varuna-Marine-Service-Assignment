import { Request, Response } from 'express';
import { GetRoutesComparisonService } from '../../../core/application/services/getRoutesComparison';
import { RoutesRepository } from '../../outbound/postgres/RoutesRepository';

const routesRepo = new RoutesRepository();
const getRoutesComparison = new GetRoutesComparisonService(routesRepo);

export async function getRoutesComparisonHandler(req: Request, res: Response) {
  try {
    const result = await getRoutesComparison.execute();
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
