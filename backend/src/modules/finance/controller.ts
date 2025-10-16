import { Request, Response } from 'express';
import { getFinanceSummary, getMonthlyCashflow } from './service';

export const getSummary = async (_req: Request, res: Response) => {
  const summary = await getFinanceSummary();
  res.json(summary);
};

export const getCashflow = async (_req: Request, res: Response) => {
  const cashflow = await getMonthlyCashflow();
  res.json(cashflow);
};
