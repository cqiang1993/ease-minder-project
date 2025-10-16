import { query } from '../../db/pool';

export type Payment = {
  id: number;
  lease_id: number;
  amount: number;
  paid_on: string;
  method: 'cash' | 'check' | 'transfer';
  reference: string | null;
  tenant_name?: string;
  unit_number?: string;
  building_name?: string;
};

export const listPayments = async () => {
  const result = await query(
    `SELECT p.*, l.tenant_name, l.rent_amount, u.unit_number, b.name AS building_name
     FROM payment p
     JOIN lease l ON p.lease_id = l.id
     JOIN unit u ON l.unit_id = u.id
     JOIN building b ON u.building_id = b.id
     ORDER BY p.paid_on DESC`
  );
  return result.rows;
};

export const createPayment = async (payload: Omit<Payment, 'id'>) => {
  const result = await query<Payment>(
    `INSERT INTO payment (lease_id, amount, paid_on, method, reference)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [payload.lease_id, payload.amount, payload.paid_on, payload.method, payload.reference]
  );
  return result.rows[0];
};

export const deletePayment = async (id: number) => {
  await query('DELETE FROM payment WHERE id = $1', [id]);
};
