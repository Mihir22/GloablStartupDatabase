let express = require("express");
let router = express.Router();

const myDB = require("../db/mySQLiteDB.js");

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Got request for /");

  const startup = await myDB.getStartup();
  const instInvestor = await myDB.getInstInvestors();
  const indiInvestor = await myDB.getIndiInvestors();


  // render the _index_ template with the fires attrib as the list of fires
  res.render("index", { startup: startup, instInvestor: instInvestor, indiInvestor: indiInvestor});
});

/* GET fire details. */
router.get("/startup/:startupID", async function (req, res) {
  

  const startupID = req.params.startupID;


  const startup = await myDB.getStartupByID(startupID);


  res.render("startupDetails", {startup: startup});
});

/* POST create fires. */
router.post("/startup/create", async function (req, res) {

  const startup = req.body;

  

  await myDB.createStartup(startup);


  res.redirect("/");
});

/* POST create fires. */
router.post("/startup/delete", async function (req, res) {
 
  const startup = req.body;


  await myDB.deleteStartup(startup);

  res.redirect("/");
});

/*Update the startup data */
router.post("/startup/update/", async function (req, res) {
 
  const body = req.body;


  await myDB.updateStartup(body);


  res.redirect("/startup/"+body.startupID);
  
});


router.post("/investor/delete", async function (req, res) {
 
  const investor = req.body;


  await myDB.deleteInvestor(investor);

  res.redirect("/");
});

router.post("/investor/inst/create", async function (req, res) {
 
  const investor = req.body;

  await myDB.createInstInvestor(investor);


  res.redirect("/");
});

router.post("/investor/indi/create", async function (req, res) {
 
  const investor = req.body;

  await myDB.createIndiInvestor(investor);


  res.redirect("/");
});


router.get("/investor/inst/:investorID", async function (req, res) {
  

  const investorID = req.params.investorID;


  const investorData = await myDB.getInstInvestorByID(startupID);


  res.render("institutionalInvestorDetails", {investor: investorData});
});






module.exports = router;
