-- Correr esto en el SQL Editor de tu proyecto Supabase

CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('ingreso', 'gasto')),
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goals (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  color TEXT DEFAULT '#22c55e',
  emoji TEXT DEFAULT '🎯',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budgets (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  monthly_limit NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS custom_categories (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('ingreso', 'gasto')),
  label TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL
);

-- Habilitar acceso público (sin auth, por ahora)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON budgets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON custom_categories FOR ALL USING (true) WITH CHECK (true);
