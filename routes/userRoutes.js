const express = require("express");
const { registerUser } = require('../controllers/registerController');
const { activateUser } = require('../controllers/activateController');

const router = express.Router();

router.post("/register", registerUser);

router.get("/activate/:token", activateUser);

module.exports = router;
