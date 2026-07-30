const { initAccessDB } = require('./init-access-db');
(async () => {
    const available = await initAccessDB();
    console.log("DB Available:", available);
    process.exit(0);
})();
