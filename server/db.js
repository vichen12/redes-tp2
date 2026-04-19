const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'finanzas.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('ingreso', 'gasto')),
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    color TEXT DEFAULT '#22c55e',
    emoji TEXT DEFAULT '🎯'
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL UNIQUE,
    monthly_limit REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS custom_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('ingreso', 'gasto')),
    label TEXT NOT NULL,
    emoji TEXT NOT NULL,
    color TEXT NOT NULL
  );
`)

module.exports = db
