import { query } from '../../db/pool';

export type Lease = {
  id: number;
  unit_id: number;
  tenant_name: string;
  tenant_email: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  security_deposit: number;
  status: 'active' | 'pending' | 'ended';
  unit_number?: string;
  building_name?: string;
};

export const listLeases = async () => {
  const result = await query(
    `SELECT l.*, u.unit_number, b.name AS building_name
     FROM lease l
     JOIN unit u ON l.unit_id = u.id
     JOIN building b ON u.building_id = b.id
     ORDER BY l.start_date DESC`
  );
  return result.rows;
};

export const createLease = async (payload: Omit<Lease, 'id'>) => {
  const result = await query<Lease>(
    `INSERT INTO lease (unit_id, tenant_name, tenant_email, start_date, end_date, rent_amount, security_deposit, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      payload.unit_id,
      payload.tenant_name,
      payload.tenant_email,
      payload.start_date,
      payload.end_date,
      payload.rent_amount,
      payload.security_deposit,
      payload.status
    ]
  );
  return result.rows[0];
};

export const updateLease = async (id: number, payload: Partial<Omit<Lease, 'id'>>) => {
  const result = await query<Lease>(
    `UPDATE lease
     SET unit_id = COALESCE($2, unit_id),
         tenant_name = COALESCE($3, tenant_name),
         tenant_email = COALESCE($4, tenant_email),
         start_date = COALESCE($5::date, start_date),
         end_date = COALESCE($6::date, end_date),
         rent_amount = COALESCE($7, rent_amount),
         security_deposit = COALESCE($8, security_deposit),
         status = COALESCE($9, status)
     WHERE id = $1
     RETURNING *`,
    [
      id,
      payload.unit_id,
      payload.tenant_name,
      payload.tenant_email,
      payload.start_date,
      payload.end_date,
      payload.rent_amount,
      payload.security_deposit,
      payload.status
    ]
  );
  return result.rows[0];
};

export const deleteLease = async (id: number) => {
  await query('DELETE FROM lease WHERE id = $1', [id]);
};
