import { Request, Response } from 'express';
import { z } from 'zod';
import { createBuilding, deleteBuilding, listBuildings, updateBuilding } from './service';

const buildingSchema = z.object({
  name: z.string().min(2),
  address: z.string(),
  city: z.string(),
  state: z.string().length(2),
  zip_code: z.string().min(5),
  total_units: z.number().int().nonnegative()
});

export const getBuildings = async (_req: Request, res: Response) => {
  const buildings = await listBuildings();
  res.json(buildings);
};

export const postBuilding = async (req: Request, res: Response) => {
  try {
    const payload = buildingSchema.parse(req.body);
    const building = await createBuilding(payload);
    res.status(201).json(building);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    res.status(500).json({ message: 'Failed to create building' });
  }
};

export const patchBuilding = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payload = buildingSchema.partial().parse(req.body);
    const building = await updateBuilding(id, payload);
    res.json(building);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    res.status(500).json({ message: 'Failed to update building' });
  }
};

export const removeBuilding = async (req: Request, res: Response) => {
  await deleteBuilding(Number(req.params.id));
  res.status(204).send();
};
