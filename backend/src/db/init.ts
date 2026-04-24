import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || './data/hhk.db';

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: sqlite3.Database;

export async function initializeDatabase(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
      } else {
        createTables()
          .then(() => {
            console.log('✅ Database initialized');
            resolve(db);
          })
          .catch(reject);
      }
    });
  });
}

async function createTables(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          full_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Payment Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS payment_orders (
          id TEXT PRIMARY KEY,
          order_code TEXT UNIQUE NOT NULL,
          user_id TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          billing_cycle TEXT NOT NULL,
          amount INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          provider_txn_id TEXT,
          payment_method TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Subscriptions table
      db.run(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          billing_cycle TEXT NOT NULL,
          status TEXT DEFAULT 'active',
          payment_order_id TEXT,
          activated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME,
          refund_deadline DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (payment_order_id) REFERENCES payment_orders(id)
        )
      `);

      // License keys table
      db.run(`
        CREATE TABLE IF NOT EXISTS license_keys (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          subscription_id TEXT NOT NULL,
          payment_order_id TEXT,
          plan_id TEXT NOT NULL,
          billing_cycle TEXT NOT NULL,
          license_key TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'issued',
          sent_via TEXT,
          sent_at DATETIME,
          issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          used_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
          FOREIGN KEY (payment_order_id) REFERENCES payment_orders(id)
        )
      `);

      // Notification queue table (e.g., Zalo send jobs)
      db.run(`
        CREATE TABLE IF NOT EXISTS notification_jobs (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          channel TEXT NOT NULL,
          payload_json TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          error_message TEXT,
          last_attempt_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Migration: add customer_phone to payment_orders (ignore if column already exists)
      db.run(`ALTER TABLE payment_orders ADD COLUMN customer_phone TEXT`, (_migrErr: any) => {
        // Swallow error – column may already exist in existing DB
        resolve(undefined);
      });
    });
  });
}

export function getDatabase(): sqlite3.Database {
  return db;
}

export function runQuery(sql: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
}

export function getOne(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getAll(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}
