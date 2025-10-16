import { Request, Response } from 'express';
import { z } from 'zod';
import { createPayment, deletePayment, listPayments } from './service';

const paymentSchema = z.object({
  lease_id: z.number().int().positive(),
  amount: z.number().positive(),
  paid_on: z.string(),
  method: z.enum(['cash', 'check', 'transfer']),
  reference: z.string().optional().nullable()
});

export const getPayments = async (_req: Request, res: Response) => {
  const payments = await listPayments();
  res.json(payments);
};

export const postPayment = async (req: Request, res: Response) => {
  try {
    const payload = paymentSchema.parse(req.body);
    const payment = await createPayment(payload);
    res.status(201).json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    res.status(500).json({ message: 'Failed to record payment' });
  }
};

export const removePayment = async (req: Request, res: Response) => {
  await deletePayment(Number(req.params.id));
  res.status(204).send();
};
