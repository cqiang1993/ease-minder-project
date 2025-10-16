import { query } from '../../db/pool';

export type Unit = {
  id: number;
  building_id: number;
  unit_number: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  market_rent: number;
  status: 'vacant' | 'occupied' | 'maintenance';
  building_name?: string;
};

export const listUnits = async () => {
  const result = await query<Unit>(
    `SELECT u.*, b.name AS building_name
     FROM unit u
     JOIN building b ON u.building_id = b.id
     ORDER BY b.name, u.unit_number`
  );
  return result.rows;
};

export const createUnit = async (payload: Omit<Unit, 'id'>) => {
  const result = await query<Unit>(
    `INSERT INTO unit (building_id, unit_number, bedrooms, bathrooms, square_feet, market_rent, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      payload.building_id,
      payload.unit_number,
      payload.bedrooms,
      payload.bathrooms,
      payload.square_feet,
      payload.market_rent,
      payload.status
    ]
  );
  return result.rows[0];
};

export const updateUnit = async (id: number, payload: Partial<Omit<Unit, 'id'>>) => {
  const result = await query<Unit>(
    `UPDATE unit
     SET building_id = COALESCE($2, building_id),
         unit_number = COALESCE($3, unit_number),
         bedrooms = COALESCE($4, bedrooms),
         bathrooms = COALESCE($5, bathrooms),
         square_feet = COALESCE($6, square_feet),
         market_rent = COALESCE($7, market_rent),
         status = COALESCE($8, status)
     WHERE id = $1
     RETURNING *`,
    [
      id,
      payload.building_id,
      payload.unit_number,
      payload.bedrooms,
      payload.bathrooms,
      payload.square_feet,
      payload.market_rent,
      payload.status
    ]
  );
  return result.rows[0];
};

export const deleteUnit = async (id: number) => {
  await query('DELETE FROM unit WHERE id = $1', [id]);
};
