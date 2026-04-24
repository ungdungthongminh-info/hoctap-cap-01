const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

const ALLOWED_SUBSCRIPTION_PLAN_IDS = [
  'free',
  'standard',
  'standard_1year_1grade',
  'standard_1year_3grade',
  'premium',
];

function getSubscriptionsTableSql() {
  const allowedPlans = ALLOWED_SUBSCRIPTION_PLAN_IDS.map((planId) => `'${planId}'`).join(',');
  return `
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planId TEXT NOT NULL CHECK(planId IN (${allowedPlans})),
      billingCycle TEXT NOT NULL CHECK(billingCycle IN ('monthly','yearly','lifetime')),
      licenseKey TEXT NOT NULL UNIQUE,
      amount INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','expired','cancelled','refunded')),
      activatedAt TEXT,
      expiresAt TEXT,
      autoRenew INTEGER DEFAULT 0,
      paymentMethod TEXT DEFAULT 'bank_transfer',
      paymentRef TEXT,
      refundDeadline TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );
  `;
}

function migrateSubscriptionsTable(db) {
  const table = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'subscriptions'").get();
  if (!table?.sql) return;

  const schemaSql = String(table.sql).toLowerCase();
  const needsMigration = !schemaSql.includes('standard_1year_1grade') || !schemaSql.includes('standard_1year_3grade');
  if (!needsMigration) return;

  const migrate = db.transaction(() => {
    db.exec('ALTER TABLE subscriptions RENAME TO subscriptions_legacy');
    db.exec(getSubscriptionsTableSql());
    db.exec(`
      INSERT INTO subscriptions (
        id, planId, billingCycle, licenseKey, amount, status, activatedAt, expiresAt,
        autoRenew, paymentMethod, paymentRef, refundDeadline, createdAt, updatedAt
      )
      SELECT
        id, planId, billingCycle, licenseKey, amount, status, activatedAt, expiresAt,
        autoRenew, paymentMethod, paymentRef, refundDeadline, createdAt, updatedAt
      FROM subscriptions_legacy
    `);
    db.exec('DROP TABLE subscriptions_legacy');
  });

  migrate();
}

function getDbPath() {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'hoc-hung-khoi.db');
}

function initDatabase() {
  const dbPath = getDbPath();
  const db = new Database(dbPath);

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create all tables
  db.exec(`
    -- 1. students
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      grade INTEGER NOT NULL DEFAULT 1,
      avatar TEXT DEFAULT 'default',
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      isActive INTEGER DEFAULT 1
    );

    -- 2. subjects
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      isActive INTEGER DEFAULT 1
    );

    -- 3. lessons
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grade INTEGER NOT NULL,
      subjectCode TEXT NOT NULL,
      unitCode TEXT NOT NULL,
      lessonCode TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      objective TEXT,
      summarySimple TEXT,
      tips TEXT,
      difficulty TEXT DEFAULT 'easy' CHECK(difficulty IN ('easy','medium','hard')),
      estimatedMinutes INTEGER DEFAULT 10,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft','ready','archived')),
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      FOREIGN KEY (subjectCode) REFERENCES subjects(code)
    );

    -- 4. lesson_cards
    CREATE TABLE IF NOT EXISTS lesson_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lessonId INTEGER NOT NULL,
      cardType TEXT NOT NULL CHECK(cardType IN ('intro','explain','example','tip','mini_check')),
      title TEXT,
      content TEXT NOT NULL,
      exampleJson TEXT,
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      FOREIGN KEY (lessonId) REFERENCES lessons(id)
    );

    -- 5. question_bank
    CREATE TABLE IF NOT EXISTS question_bank (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grade INTEGER NOT NULL,
      subjectCode TEXT NOT NULL,
      lessonId INTEGER NOT NULL,
      questionType TEXT NOT NULL CHECK(questionType IN ('single_choice','true_false','fill_number')),
      questionText TEXT NOT NULL,
      optionsJson TEXT,
      correctAnswer TEXT NOT NULL,
      explanationSimple TEXT,
      difficulty TEXT DEFAULT 'easy' CHECK(difficulty IN ('easy','medium','hard')),
      skillTag TEXT,
      sourceType TEXT DEFAULT 'manual' CHECK(sourceType IN ('manual','imported')),
      isVerified INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      FOREIGN KEY (lessonId) REFERENCES lessons(id),
      FOREIGN KEY (subjectCode) REFERENCES subjects(code)
    );

    -- 6. practice_sets
    CREATE TABLE IF NOT EXISTS practice_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      lessonId INTEGER NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('practice_5','practice_10','practice_15','review_wrong')),
      questionIdsJson TEXT NOT NULL,
      startedAt TEXT DEFAULT (datetime('now')),
      finishedAt TEXT,
      score REAL,
      correctCount INTEGER DEFAULT 0,
      wrongCount INTEGER DEFAULT 0,
      FOREIGN KEY (studentId) REFERENCES students(id),
      FOREIGN KEY (lessonId) REFERENCES lessons(id)
    );

    -- 7. student_answers
    CREATE TABLE IF NOT EXISTS student_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      practiceSetId INTEGER NOT NULL,
      questionId INTEGER NOT NULL,
      selectedAnswer TEXT,
      isCorrect INTEGER DEFAULT 0,
      answeredAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (practiceSetId) REFERENCES practice_sets(id),
      FOREIGN KEY (questionId) REFERENCES question_bank(id)
    );

    -- 8. student_progress
    CREATE TABLE IF NOT EXISTS student_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      grade INTEGER NOT NULL,
      subjectCode TEXT NOT NULL,
      lessonId INTEGER NOT NULL,
      lastScore REAL DEFAULT 0,
      bestScore REAL DEFAULT 0,
      attemptCount INTEGER DEFAULT 0,
      masteryLevel TEXT DEFAULT 'new' CHECK(masteryLevel IN ('new','learning','good','mastered')),
      lastStudiedAt TEXT,
      needsReview INTEGER DEFAULT 0,
      FOREIGN KEY (studentId) REFERENCES students(id),
      FOREIGN KEY (lessonId) REFERENCES lessons(id),
      UNIQUE(studentId, lessonId)
    );

    -- 9. content_import_jobs
    CREATE TABLE IF NOT EXISTS content_import_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      importType TEXT NOT NULL,
      fileName TEXT NOT NULL,
      totalRows INTEGER DEFAULT 0,
      successRows INTEGER DEFAULT 0,
      errorRows INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','processing','completed','failed')),
      errorLogJson TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );

    -- 10. data_health_snapshot
    CREATE TABLE IF NOT EXISTS data_health_snapshot (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grade INTEGER NOT NULL,
      subjectCode TEXT NOT NULL,
      lessonCount INTEGER DEFAULT 0,
      lessonCardCount INTEGER DEFAULT 0,
      questionCount INTEGER DEFAULT 0,
      verifiedQuestionCount INTEGER DEFAULT 0,
      snapshotAt TEXT DEFAULT (datetime('now'))
    );

    -- 11. app_settings (thêm cho PIN, theme, giới hạn)
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- 12. subscriptions — Quản lý gói dịch vụ & gia hạn
    ${getSubscriptionsTableSql()}

    -- Seed default subject
    INSERT OR IGNORE INTO subjects (code, name, isActive) VALUES ('math', 'Toán', 1);
  `);

  migrateSubscriptionsTable(db);

  return db;
}

module.exports = { initDatabase, getDbPath };
