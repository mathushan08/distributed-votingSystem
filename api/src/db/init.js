const pool = require("./postgres");
const crypto = require("crypto");

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'USER',
        is_verified BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS elections (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        created_by UUID REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS candidates (
        id UUID PRIMARY KEY,
        election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS votes (
        id UUID PRIMARY KEY,
        voter_id UUID REFERENCES users(id),
        election_id UUID REFERENCES elections(id),
        candidate_id UUID REFERENCES candidates(id),
        UNIQUE(voter_id, election_id)
      );

      CREATE TABLE IF NOT EXISTS otp_codes (
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        type TEXT NOT NULL
      );
    `);
    console.log("Database initialized successfully");

    // Migration for is_verified column
    try {
      await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE");
    } catch (e) {
      console.log("Migration check: is_verified column likely exists or error ignored");
    }

    // Seed Admin
    const adminEmail = "admin@test.com";
    const adminPass = "admin123";
    const adminHash = Buffer.from(adminPass).toString("base64"); // Matches legacy auth

    const res = await pool.query("SELECT 1 FROM users WHERE email = $1", [adminEmail]);
    if (res.rowCount === 0) {
      const id = crypto.randomUUID();
      await pool.query(
        "INSERT INTO users (id, email, password_hash, role) VALUES ($1, $2, $3, 'ADMIN')",
        [id, adminEmail, adminHash]
      );
      console.log("Admin user seeded");
    } else {
      await pool.query("UPDATE users SET role = 'ADMIN' WHERE email = $1", [adminEmail]);
      console.log("Admin user role verified");
    }

  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
};

module.exports = initDb;
