import { Request, Response } from 'express';
import { GetCBService } from '../../../core/application/services/getCB';
import { GetAdjustedCBService } from '../../../core/application/services/getAdjustedCB';
import { RoutesRepository } from '../../outbound/postgres/RoutesRepository';
import { BankingRepository } from '../../outbound/postgres/BankingRepository';

const routesRepo = new RoutesRepository();
const bankingRepo = new BankingRepository(routesRepo);
const getCB = new GetCBService(routesRepo);
const getAdjustedCB = new GetAdjustedCBService(routesRepo, bankingRepo);

export async function getCBHandler(req: Request, res: Response) {
  try {
    const { shipId, year } = req.query;
    
    if (!shipId || !year) {
      return res.status(400).json({ error: 'shipId and year are required', code: 'MISSING_PARAMS' });
    }

    // For now, treat shipId as routeCode (can be updated later to use ShipCompliance)
    const routeCode = shipId as string;
    const result = await getCB.execute(routeCode, Number(year));
    
    // Return cb_before in gCO2e (not tonnes) BEFORE any banking application
    return res.json({
      shipId: routeCode,
      year: Number(year),
      cb_before: result.cb_gCO2e,
      unit: 'gCO2e',
      details: {
        actualIntensity: result.actualIntensity,
        cb_tonnesCO2e: result.cb_tonnesCO2e,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message, code: 'ROUTE_NOT_FOUND' });
      } else {
        return res.status(400).json({ error: error.message, code: 'INVALID_REQUEST' });
      }
    } else {
      return res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
    }
  }
}

export async function getAdjustedCBHandler(req: Request, res: Response) {
  try {
    const { year } = req.query;
    
    if (!year) {
      return res.status(400).json({ error: 'year is required', code: 'MISSING_PARAMS' });
    }

    const yearNum = Number(year);
    if (isNaN(yearNum) || !Number.isInteger(yearNum)) {
      return res.status(400).json({ error: 'year must be a valid integer', code: 'INVALID_YEAR' });
    }

    const result = await getAdjustedCB.execute(yearNum);
    return res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message, code: 'INVALID_REQUEST' });
    } else {
      return res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
    }
  }
}
