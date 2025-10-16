import { Request, Response } from 'express';
import { z } from 'zod';
import { createUnit, deleteUnit, listUnits, updateUnit } from './service';

const unitSchema = z.object({
  building_id: z.number().int().positive(),
  unit_number: z.string().min(1),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  square_feet: z.number().int().positive(),
  market_rent: z.number().positive(),
  status: z.enum(['vacant', 'occupied', 'maintenance'])
});

export const getUnits = async (_req: Request, res: Response) => {
  const units = await listUnits();
  res.json(units);
};

export const postUnit = async (req: Request, res: Response) => {
  try {
    const payload = unitSchema.parse(req.body);
    const unit = await createUnit(payload);
    res.status(201).json(unit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    res.status(500).json({ message: 'Failed to create unit' });
  }
};

export const patchUnit = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payload = unitSchema.partial().parse(req.body);
    const unit = await updateUnit(id, payload);
    res.json(unit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    res.status(500).json({ message: 'Failed to update unit' });
  }
};

export const removeUnit = async (req: Request, res: Response) => {
  await deleteUnit(Number(req.params.id));
  res.status(204).send();
};
