import { Request, Response } from 'express';
import { GetCBService } from '../../../core/application/services/getCB';
import { RoutesRepository } from '../../outbound/postgres/RoutesRepository';

const routesRepo = new RoutesRepository();
const getCB = new GetCBService(routesRepo);

export async function getCBHandler(req: Request, res: Response) {
  try {
    const { routeCode, year } = req.query;
    
    if (!routeCode || !year) {
      return res.status(400).json({ error: 'routeCode and year are required' });
    }

    const result = await getCB.execute(routeCode as string, Number(year));
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

