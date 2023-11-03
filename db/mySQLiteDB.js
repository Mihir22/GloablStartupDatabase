const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

sqlite3.verbose();

async function connect() {
  return open({
    filename: "./db/Startup.db",
    driver: sqlite3.Database,
  });

 
}

async function getStartup() {
  const db = await connect();
  try {
    return await db.all("SELECT * FROM Startup ORDER BY startupId DESC");
  } finally {
    // await db.close();
  }
  
}

async function getInstInvestors() {
  const db = await connect();
  
  try {
    return await db.all("SELECT * FROM INVESTOR a INNER JOIN InstitutionalInvestor b ON a.investorID = b.investorID");
  } finally {

  }
}

async function getIndiInvestors() {
  const db = await connect();
  
  try {
    return await db.all("SELECT * FROM INVESTOR a INNER JOIN IndividualInvestor b ON a.investorID = b.investorID");
  } finally {

  }
}

async function createStartup(newFire) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`INSERT INTO
    Startup(name, category, fundingTotal, status)
    VALUES (:name, :category, :fundingTotal, :status)
  `);
  console.log("Startup value", newFire);
  stmt.bind({
    ":name": newFire.name,
    ":category": newFire.category,
    ":fundingTotal": newFire.fundingTotal,
    ":status": newFire.status,
  });

   await stmt.run();
   await stmt.finalize();
  } finally {
    // db.close();
  }

  
}

async function createInstInvestor(newInvestor) {
  const db = await connect();

  try {
    let stmt = await db.prepare(`INSERT INTO
            Investor(name, contactInfo, country)
            VALUES (:name, :contactInfo, :country)
        `);

        let result = await stmt.run({
            ":name": newInvestor.name,
            ":contactInfo": newInvestor.contactInfo,
            ":country": newInvestor.country
        });

        await stmt.finalize();

        // Get the generated investorID
        const investorID = result.lastID;

        // Step 2: Insert into the InstitutionalInvestor table
        stmt = await db.prepare(`INSERT INTO
            InstitutionalInvestor(investorID, foundingDate, numberOfMembers, assetUnderManagement)
            VALUES (:investorID, :foundingDate, :numberOfMembers, :assetUnderManagement)
        `);

        await stmt.run({
            ":investorID": investorID,
            ":foundingDate": newInvestor.foundingDate,
            ":numberOfMembers": newInvestor.numberOfMembers,
            ":assetUnderManagement": newInvestor.assetUnderManagement
        });

        await stmt.finalize();
  } finally {
    // db.close();
  }
  
}

async function createIndiInvestor(newInvestor) {
  const db = await connect();

  try {
    let stmt = await db.prepare(`INSERT INTO
            Investor(name, contactInfo, country)
            VALUES (:name, :contactInfo, :country)
        `);

        let result = await stmt.run({
            ":name": newInvestor.name,
            ":contactInfo": newInvestor.contactInfo,
            ":country": newInvestor.country
        });

        await stmt.finalize();

        // Get the generated investorID
        const investorID = result.lastID;

        // Step 2: Insert into the IndividualInvestor table
        stmt = await db.prepare(`INSERT INTO
            IndividualInvestor(investorID, birthDate, netWorth)
            VALUES (:investorID, :birthDate, :netWorth)
        `);

        await stmt.run({
            ":investorID": investorID,
            ":birthDate": newInvestor.birthDate,
            ":netWorth": newInvestor.netWorth
        });

        await stmt.finalize();
  } finally {
    // db.close();
  }
  
}

async function getStartupByID(fireID) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`SELECT *
    FROM Startup
    WHERE
      startupID = :fireID
  `);

  stmt.bind({
    ":fireID": fireID,
  });

  return await stmt.get();
  } finally {
    // db.close();
  }
  
}

async function deleteStartup(fireToDelete) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`DELETE FROM
    Startup
    WHERE startupID = :theIDToDelete
  `);

  stmt.bind({
    ":theIDToDelete": fireToDelete.startupID,
  });

   await stmt.run();
   await stmt.finalize();
  } finally {
    // db.close();
  }
 
}

async function updateStartup(startup) {
  const db = await connect();

  try {
    console.log(startup);
    const stmt = await db.prepare(`UPDATE Startup
    SET name = :name, category = :category,
    fundingTotal = :fundingTotal, status = :status
    WHERE startupID = :id;
  `);
  console.log("Startup value", startup);
  stmt.bind({
    ":id":startup.startupID,
    ":name": startup.name,
    ":category": startup.category,
    ":fundingTotal": startup.fundingTotal,
    ":status": startup.status
  });

   await stmt.run();
   await stmt.finalize();
  } finally {
    // db.close();
  }

}

async function deleteInvestor(investorToDelete) {
  const db = await connect();
  // await db.run('PRAGMA foreign_keys = ON;'); // Enable foreign key constraints

  try {
   
    const stmt = await db.prepare(`DELETE FROM Investor WHERE investorID = :theIDToDelete`);
    
   console.log(investorToDelete.investorID);

  stmt.bind({
    ":theIDToDelete": investorToDelete.investorID,
  });

   await stmt.run();
   await stmt.finalize();
  } finally {
    // db.close();
  }
 
}

async function getInstInvestorByID(fireID) {
  const db = await connect();

  try {
    const stmt = await db.prepare(`SELECT * FROM INVESTOR a INNER JOIN InstitutionalInvestor b ON a.investorID = b.investorID WHERE 
    a.investorID = :investorID`);


  stmt.bind({
    ":investorID": fireID,
  });

  return await stmt.get();
  } finally {
    // db.close();
  }
  
}


module.exports.getStartup = getStartup;
module.exports.createStartup = createStartup;
module.exports.deleteStartup = deleteStartup;
module.exports.getStartupByID = getStartupByID;
module.exports.updateStartup = updateStartup;
module.exports.getInstInvestors = getInstInvestors;
module.exports.deleteInvestor = deleteInvestor;
module.exports.getIndiInvestors = getIndiInvestors;
module.exports.createInstInvestor = createInstInvestor;
module.exports.createIndiInvestor = createIndiInvestor;
module.exports.getInstInvestorByID = getInstInvestorByID;
