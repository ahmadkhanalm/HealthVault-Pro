const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data/store.json');
const db = JSON.parse(fs.readFileSync(dbPath));

if (db.patients['374000000025']) {
    db.patients['374000000025'].testReports.push({
        id: "dummy-report-123",
        fileName: "dummy.pdf",
        filePath: "/uploads/dummy.pdf",
        uploadDate: new Date().toISOString(),
        referringDoctor: "Test Doc",
        diseaseCause: "DUMMY REPORT TO TEST DELETION"
    });

    db.patients['374000000025'].medicalHistory.push({
        id: "dummy-history-123",
        date: new Date().toISOString(),
        diagnosis: "DUMMY DIAGNOSIS TO TEST DELETION",
        treatment: "Test Treatment",
        hospitalName: "Test Hospital",
        doctorName: "Dr. Test",
        notes: "Testing deletion",
        medicines: [],
        prescribedTests: [],
        precautions: ""
    });

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log("Dummy data injected.");
}
