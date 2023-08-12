const express = require("express");
const router = express.Router();
const usersAPI = require('../../../controllers/api/v1/users_api');

router.post('/create-session',usersAPI.createSession);

module.exports=router;