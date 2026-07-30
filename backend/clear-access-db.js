/**
 * clear-access-db.js
 * One-shot script called by reset_v2.bat.
 * Clears all rows from the Patients table in the Access DB
 * WITHOUT deleting the .accdb file itself.
 */

const { initAccessDB, clearAllPatients } = require('./init-access-db');

(async () => {
    console.log('[Reset] Connecting to Access DB...');
    const ok = await initAccessDB();

    if (!ok) {
        console.log('[Reset] Access DB not available — skipping Access clear.');
        process.exit(0);
    }

    const result = await clearAllPatients();

    if (result.success) {
        console.log('[Reset] Access DB patient registry cleared successfully.');
    } else {
        console.error('[Reset] Failed to clear Access DB:', result.message);
        process.exit(1);
    }

    process.exit(0);
})();
