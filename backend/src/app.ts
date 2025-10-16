import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { register, login } from './modules/auth/controller';
import { authenticate } from './middleware/authenticate';
import { getBuildings, patchBuilding, postBuilding, removeBuilding } from './modules/buildings/controller';
import { getUnits, patchUnit, postUnit, removeUnit } from './modules/units/controller';
import { getLeases, patchLease, postLease, removeLease } from './modules/leases/controller';
import { getPayments, postPayment, removePayment } from './modules/payments/controller';
import { getSummary, getCashflow } from './modules/finance/controller';
import { getUsers } from './modules/users/controller';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/auth/register', register);
  app.post('/auth/login', login);

  app.get('/buildings', authenticate(), getBuildings);
  app.post('/buildings', authenticate(['manager']), postBuilding);
  app.patch('/buildings/:id', authenticate(['manager']), patchBuilding);
  app.delete('/buildings/:id', authenticate(['manager']), removeBuilding);

  app.get('/units', authenticate(), getUnits);
  app.post('/units', authenticate(['manager']), postUnit);
  app.patch('/units/:id', authenticate(['manager']), patchUnit);
  app.delete('/units/:id', authenticate(['manager']), removeUnit);

  app.get('/leases', authenticate(), getLeases);
  app.post('/leases', authenticate(['manager']), postLease);
  app.patch('/leases/:id', authenticate(['manager']), patchLease);
  app.delete('/leases/:id', authenticate(['manager']), removeLease);

  app.get('/payments', authenticate(['manager', 'accountant']), getPayments);
  app.post('/payments', authenticate(['manager', 'accountant']), postPayment);
  app.delete('/payments/:id', authenticate(['manager', 'accountant']), removePayment);

  app.get('/finance/summary', authenticate(['manager', 'accountant']), getSummary);
  app.get('/finance/cashflow', authenticate(['manager', 'accountant']), getCashflow);

  app.get('/users', authenticate(['manager']), getUsers);

  return app;
};
