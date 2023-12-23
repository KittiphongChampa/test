let express = require("express");
let router = express.Router();

const signinController = require("../controllers/signinController");


router.get("/user", signinController.user);

module.exports = router;