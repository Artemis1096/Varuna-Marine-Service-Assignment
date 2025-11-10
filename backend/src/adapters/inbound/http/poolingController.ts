import { Request, Response } from 'express';
import { CreatePoolService } from '../../../core/application/services/createPool';

const createPool = new CreatePoolService();

export async function createPoolHandler(req: Request, res: Response): Promise<void> {
  try {
    const { year, members } = req.body;

    if (!year || !members || !Array.isArray(members)) {
      res.status(400).json({ error: 'year and members (array) are required', code: 'MISSING_PARAMS' });
      return;
    }

    // Validate members structure
    if (members.length === 0) {
      res.status(400).json({ error: 'Pool must have at least one member', code: 'INVALID_POOL' });
      return;
    }

    for (const member of members) {
      if (!member.shipId || member.cb_before === undefined) {
        res.status(400).json({ error: 'Each member must have shipId and cb_before', code: 'INVALID_MEMBER' });
        return;
      }
    }

    const yearNum = Number(year);
    if (isNaN(yearNum) || !Number.isInteger(yearNum)) {
      res.status(400).json({ error: 'year must be a valid integer', code: 'INVALID_YEAR' });
      return;
    }

    const result = createPool.execute(yearNum, members);
    res.json(result);
  } catch (error: any) {
    if (error instanceof Error) {
      const errorCode = (error as any).code || 'INVALID_REQUEST';
      if (errorCode === 'POOL_SUM_NEGATIVE' || errorCode === 'DEFICIT_SHIP_WORSE' || errorCode === 'SURPLUS_SHIP_NEGATIVE' || errorCode === 'INVALID_POOL') {
        res.status(400).json({ error: error.message, code: errorCode });
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

