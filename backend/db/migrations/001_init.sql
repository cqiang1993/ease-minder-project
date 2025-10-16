CREATE TABLE IF NOT EXISTS building (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  zip_code TEXT NOT NULL,
  total_units INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS unit (
  id SERIAL PRIMARY KEY,
  building_id INTEGER NOT NULL REFERENCES building(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms NUMERIC(3,1) NOT NULL DEFAULT 1,
  square_feet INTEGER NOT NULL DEFAULT 0,
  market_rent NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'vacant',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lease (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES unit(id) ON DELETE CASCADE,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rent_amount NUMERIC(10,2) NOT NULL,
  security_deposit NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment (
  id SERIAL PRIMARY KEY,
  lease_id INTEGER NOT NULL REFERENCES lease(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  paid_on DATE NOT NULL,
  method TEXT NOT NULL,
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_user (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permission (
  role TEXT PRIMARY KEY,
  permissions TEXT[] NOT NULL
);

INSERT INTO role_permission(role, permissions) VALUES
  ('manager', ARRAY['buildings:write', 'units:write', 'leases:write', 'payments:write', 'finance:read', 'users:read']),
  ('accountant', ARRAY['payments:write', 'finance:read']),
  ('maintenance', ARRAY['units:read'])
ON CONFLICT (role) DO NOTHING;
