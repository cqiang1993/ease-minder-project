import { query } from '../../db/pool';

export type Building = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  total_units: number;
};

export const listBuildings = async () => {
  const result = await query<Building>('SELECT * FROM building ORDER BY name');
  return result.rows;
};

export const createBuilding = async (payload: Omit<Building, 'id'>) => {
  const result = await query<Building>(
    `INSERT INTO building (name, address, city, state, zip_code, total_units)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [payload.name, payload.address, payload.city, payload.state, payload.zip_code, payload.total_units]
  );
  return result.rows[0];
};

export const updateBuilding = async (id: number, payload: Partial<Omit<Building, 'id'>>) => {
  const result = await query<Building>(
    `UPDATE building
     SET name = COALESCE($2, name),
         address = COALESCE($3, address),
         city = COALESCE($4, city),
         state = COALESCE($5, state),
         zip_code = COALESCE($6, zip_code),
         total_units = COALESCE($7, total_units)
     WHERE id = $1
     RETURNING *`,
    [id, payload.name, payload.address, payload.city, payload.state, payload.zip_code, payload.total_units]
  );
  return result.rows[0];
};

export const deleteBuilding = async (id: number) => {
  await query('DELETE FROM building WHERE id = $1', [id]);
};
