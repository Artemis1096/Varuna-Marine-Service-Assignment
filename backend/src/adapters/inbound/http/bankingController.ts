import { Request, Response } from 'express';
import { BankSurplusService } from '../../../core/application/services/bankSurplus';
import { ApplyBankedService } from '../../../core/application/services/applyBanked';
import { GetCBService } from '../../../core/application/services/getCB';
import { BankingRepository } from '../../outbound/postgres/BankingRepository';
import { RoutesRepository } from '../../outbound/postgres/RoutesRepository';

const routesRepo = new RoutesRepository();
const getCB = new GetCBService(routesRepo);
const bankingRepo = new BankingRepository(routesRepo);
const bankSurplus = new BankSurplusService(getCB, bankingRepo);
const applyBanked = new ApplyBankedService(getCB, bankingRepo);

export async function bankSurplusHandler(req: Request, res: Response): Promise<void> {
  try {
    const { shipId, year, amount_gco2eq } = req.body;

    if (!shipId || year === undefined || amount_gco2eq === undefined) {
      res.status(400).json({ error: 'shipId, year, and amount_gco2eq are required', code: 'MISSING_PARAMS' });
      return;
    }

    // For now, treat shipId as routeCode (can be updated later to use ShipCompliance)
    const routeCode = shipId as string;
    const result = await bankSurplus.execute(routeCode, Number(year), Number(amount_gco2eq));
    res.json(result);
  } catch (error: any) {
    if (error instanceof Error) {
      const errorCode = (error as any).code || 'INVALID_REQUEST';
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message, code: 'ROUTE_NOT_FOUND' });
        return;
      } else if ((error as any).code === 'CB_NOT_POSITIVE' || (error as any).code === 'INVALID_AMOUNT' || (error as any).code === 'AMOUNT_EXCEEDS_AVAILABLE') {
        res.status(400).json({ error: error.message, code: (error as any).code });
        return;
      } else {
        res.status(400).json({ error: error.message, code: errorCode });
        return;
      }
    } else {
      res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
      return;
    }
  }
}

export async function applyBankedHandler(req: Request, res: Response): Promise<void> {
  try {
    const { shipId, year, amount_gco2eq } = req.body;

    if (!shipId || year === undefined || amount_gco2eq === undefined) {
      res.status(400).json({ error: 'shipId, year, and amount_gco2eq are required', code: 'MISSING_PARAMS' });
      return;
    }

    // For now, treat shipId as routeCode (can be updated later to use ShipCompliance)
    const routeCode = shipId as string;
    const result = await applyBanked.execute(routeCode, Number(year), Number(amount_gco2eq));
    res.json(result);
  } catch (error: any) {
    if (error instanceof Error) {
      const errorCode = (error as any).code || 'INVALID_REQUEST';
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message, code: 'ROUTE_NOT_FOUND' });
        return;
      } else if ((error as any).code === 'INVALID_AMOUNT' || (error as any).code === 'AMOUNT_EXCEEDS_AVAILABLE' || (error as any).code === 'NO_BANKED_SURPLUS') {
        res.status(400).json({ error: error.message, code: (error as any).code });
        return;
      } else {
        res.status(400).json({ error: error.message, code: errorCode });
        return;
      }
    } else {
      res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
      return;
    }
  }
}

