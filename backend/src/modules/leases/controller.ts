import { Request, Response } from 'express';
import { z } from 'zod';
import { createLease, deleteLease, listLeases, updateLease } from './service';

const leaseSchema = z.object({
  unit_id: z.number().int().positive(),
  tenant_name: z.string().min(2),
  tenant_email: z.string().email(),
  start_date: z.string(),
  end_date: z.string(),
  rent_amount: z.number().positive(),
  security_deposit: z.number().nonnegative(),
  status: z.enum(['active', 'pending', 'ended'])
});

export const getLeases = async (_req: Request, res: Response) => {
  const leases = await listLeases();
  res.json(leases);
};

export const postLease = async (req: Request, res: Response) => {
  try {
    const payload = leaseSchema.parse(req.body);
    const lease = await createLease(payload);
    res.status(201).json(lease);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    res.status(500).json({ message: 'Failed to create lease' });
  }
};

export const patchLease = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payload = leaseSchema.partial().parse(req.body);
    const lease = await updateLease(id, payload);
    res.json(lease);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    res.status(500).json({ message: 'Failed to update lease' });
  }
};

export const removeLease = async (req: Request, res: Response) => {
  await deleteLease(Number(req.params.id));
  res.status(204).send();
};
