import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../../db/pool';
import { env } from '../../config/env';

type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  role: string;
  name: string;
};

export const registerUser = async (email: string, password: string, role: string, name: string) => {
  const hash = await bcrypt.hash(password, 10);
  const existing = await query('SELECT id FROM app_user WHERE email = $1', [email]);
  if (existing.rowCount && existing.rowCount > 0) {
    throw new Error('User already exists');
  }
  const result = await query(
    'INSERT INTO app_user (email, password_hash, role, name) VALUES ($1, $2, $3, $4) RETURNING id, email, role, name',
    [email, hash, role, name]
  );
  return result.rows[0];
};

export const authenticateUser = async (email: string, password: string) => {
  const result = await query<UserRow>('SELECT * FROM app_user WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, env.jwtSecret, {
    expiresIn: '12h'
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  };
};
