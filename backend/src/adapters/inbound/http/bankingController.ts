import { Request, Response } from 'express';
import { BankSurplusService } from '../../../core/application/services/bankSurplus';
import { GetCBService } from '../../../core/application/services/getCB';
import { BankingRepository } from '../../outbound/postgres/BankingRepository';
import { RoutesRepository } from '../../outbound/postgres/RoutesRepository';

const routesRepo = new RoutesRepository();
const getCB = new GetCBService(routesRepo);
const bankingRepo = new BankingRepository(routesRepo);
const bankSurplus = new BankSurplusService(getCB, bankingRepo);

export async function bankSurplusHandler(req: Request, res: Response) {
  try {
    const { routeCode, year } = req.body;

    if (!routeCode || !year) {
      return res.status(400).json({ error: 'routeCode and year are required' });
    }

    const result = await bankSurplus.execute(routeCode, Number(year));
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('Cannot bank')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

