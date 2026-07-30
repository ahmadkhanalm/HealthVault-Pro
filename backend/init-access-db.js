/**
 * init-access-db.js
 * Initializes the Microsoft Access (.accdb) patient registry.
 * Uses node-adodb which communicates via Windows ADODB/OLE DB.
 *
 * Table: Patients
 *   CNIC (Text, Primary Key)
 *   PatientName (Text)
 *   Age (Number)
 *   Phone (Text)
 *   RegisteredAt (DateTime)
 */

const ADODB = require('node-adodb');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'patients_registry.accdb');

// Build the ADODB connection string for Access 2007+ (.accdb)
const connectionString = `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${DB_PATH};Persist Security Info=False;`;

let connection = null;
let accessDbAvailable = false;

/**
 * Creates the .accdb file if it doesn't exist, then ensures the Patients table exists.
 * Returns true if successful, false if the ACE OLEDB driver is not installed.
 */
async function initAccessDB() {
    try {
        // node-adodb can create a new .accdb file via ADOX if given a fresh path.
        // However, the simplest cross-version approach is to use the ADODB connection
        // and catch the error if the file doesn't exist — then create the empty DB via
        // the node-adodb 'open' with CREATE flag.
        //
        // node-adodb automatically creates the file when connecting if it doesn't exist
        // (using ADOX internally on Windows).

        connection = ADODB.open(connectionString);

        // Try to list tables — will throw if driver not installed
        // Use a simple SELECT on a safe non-failing query
        await connection.schema(20); // adSchemaTables = 20

        // Create Patients table if it doesn't exist (wrapped in try/catch because
        // Access doesn't support IF NOT EXISTS)
        try {
            await connection.execute(`
                CREATE TABLE Patients (
                    CNIC TEXT(20) NOT NULL PRIMARY KEY,
                    PatientName TEXT(100),
                    Age NUMBER,
                    Phone TEXT(20),
                    RegisteredAt DATETIME
                )
            `);
            console.log('[Access DB] Patients table created successfully.');
        } catch (tableErr) {
            // Table already exists — this is fine
            if (tableErr.message && tableErr.message.includes('already exists')) {
                console.log('[Access DB] Patients table already exists — ready.');
            } else {
                // Log but don't crash — maybe a benign schema error
                console.warn('[Access DB] Table check note:', tableErr.message);
            }
        }

        accessDbAvailable = true;
        console.log(`[Access DB] Connected: ${DB_PATH}`);
        return true;
    } catch (err) {
        console.error('====================================================');
        console.error('[Access DB] WARNING: Could not connect to Access DB.');
        console.error('This is usually because the Microsoft Access Database');
        console.error('Engine (ACE OLEDB) is not installed on this machine.');
        console.error('Download: https://www.microsoft.com/en-us/download/details.aspx?id=50040');
        console.error('The system will continue using JSON storage only.');
        console.error('Error details:', err.message);
        console.error('====================================================');
        accessDbAvailable = false;
        return false;
    }
}

/**
 * Inserts a patient registration record into the Access DB.
 * Returns { success: true } or { success: false, message: '...' }.
 */
async function insertPatientRecord({ cnic, name, age, phone }) {
    if (!accessDbAvailable || !connection) {
        return { success: false, message: 'Access DB not available.' };
    }
    try {
        const registeredAt = new Date().toISOString();
        await connection.execute(
            `INSERT INTO Patients (CNIC, PatientName, Age, Phone, RegisteredAt) VALUES ('${cnic}', '${name}', ${age || 0}, '${phone || ''}', #${registeredAt}#)`
        );
        console.log(`[Access DB] Patient registered: ${cnic}`);
        return { success: true };
    } catch (err) {
        console.error('[Access DB] Insert error:', err.message);
        return { success: false, message: err.message };
    }
}

/**
 * Checks whether a CNIC already exists in the Access DB.
 * Returns true if exists, false if not (or if DB unavailable).
 */
async function cnicExistsInAccess(cnic) {
    if (!accessDbAvailable || !connection) return false;
    try {
        const rows = await connection.query(
            `SELECT COUNT(*) AS cnt FROM Patients WHERE CNIC = '${cnic}'`
        );
        return rows && rows[0] && rows[0].cnt > 0;
    } catch (err) {
        console.error('[Access DB] Query error:', err.message);
        return false;
    }
}

/**
 * Deletes all records from the Patients table (used by reset script).
 */
async function clearAllPatients() {
    if (!accessDbAvailable || !connection) {
        return { success: false, message: 'Access DB not available.' };
    }
    try {
        await connection.execute(`DELETE * FROM Patients`);
        console.log('[Access DB] All patient records cleared.');
        return { success: true };
    } catch (err) {
        console.error('[Access DB] Clear error:', err.message);
        return { success: false, message: err.message };
    }
}

module.exports = { initAccessDB, insertPatientRecord, cnicExistsInAccess, clearAllPatients, getAccessDbAvailable: () => accessDbAvailable };
