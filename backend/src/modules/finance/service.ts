import { query } from '../../db/pool';

export type FinanceSummary = {
  total_units: number;
  occupied_units: number;
  total_rent_due: number;
  total_rent_collected: number;
  arrears: number;
};

export const getFinanceSummary = async () => {
  const result = await query<FinanceSummary>(
    `WITH rent_due AS (
        SELECT COALESCE(SUM(rent_amount), 0)::numeric AS due
        FROM lease
        WHERE status = 'active'
      ),
      rent_paid AS (
        SELECT COALESCE(SUM(amount), 0)::numeric AS paid
        FROM payment
        WHERE paid_on >= date_trunc('month', CURRENT_DATE)
      ),
      occupancy AS (
        SELECT COUNT(*) FILTER (WHERE status = 'occupied') AS occupied,
               COUNT(*) AS total
        FROM unit
      )
     SELECT o.total AS total_units,
            o.occupied AS occupied_units,
            r.due AS total_rent_due,
            p.paid AS total_rent_collected,
            GREATEST(r.due - p.paid, 0) AS arrears
     FROM rent_due r, rent_paid p, occupancy o`
  );
  return result.rows[0];
};

export const getMonthlyCashflow = async () => {
  const result = await query(
    `SELECT date_trunc('month', paid_on) AS month,
            SUM(amount) AS collected
     FROM payment
     GROUP BY month
     ORDER BY month DESC
     LIMIT 12`
  );
  return result.rows;
};
