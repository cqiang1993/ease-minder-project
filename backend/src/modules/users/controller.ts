import { Request, Response } from 'express';
import { listUsers } from './service';

export const getUsers = async (_req: Request, res: Response) => {
  const users = await listUsers();
  res.json(users);
};
