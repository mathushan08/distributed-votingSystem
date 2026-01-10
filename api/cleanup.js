const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://voting:voting@localhost:5432/votingdb'
});

async function run() {
    try {
        const res = await pool.query("DELETE FROM votes WHERE voter_id IS NULL");
        console.log(`Deleted ${res.rowCount} invalid votes.`);
    } catch (e) {
        if (e.code === 'ECONNREFUSED') {
            console.log("Could not connect to localhost:5432. Trying without cleaning (maybe running in docker?)");
        } else {
            console.error("Cleanup error:", e);
        }
    } finally {
        await pool.end();
    }
}
run();
