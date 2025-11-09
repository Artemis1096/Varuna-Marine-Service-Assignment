import { Request, Response } from 'express';
import { CreatePoolService } from '../../../core/application/services/createPool';
import { GetCBService } from '../../../core/application/services/getCB';
import { PoolingRepository } from '../../outbound/postgres/PoolingRepository';
import { RoutesRepository } from '../../outbound/postgres/RoutesRepository';

const routesRepo = new RoutesRepository();
const getCB = new GetCBService(routesRepo);
const poolingRepo = new PoolingRepository(routesRepo);
const createPool = new CreatePoolService(getCB, poolingRepo);

export async function createPoolHandler(req: Request, res: Response): Promise<void> {
  try {
    const { name, year, members } = req.body;

    if (!name || !year || !members || !Array.isArray(members)) {
      res.status(400).json({ error: 'name, year, and members (array) are required' });
      return;
    }

    const result = await createPool.execute(name, Number(year), members);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('cannot have net deficit')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

