import { query } from '../../db/pool';

type User = {
  id: number;
  email: string;
  role: string;
  name: string;
  created_at: string;
};

export const listUsers = async () => {
  const result = await query<User>(
    `SELECT id, email, role, name, created_at
     FROM app_user
     ORDER BY created_at DESC`
  );
  return result.rows;
};
