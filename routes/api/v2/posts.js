const express = require("express");
const router = express.Router();
const postsAPI = require('../../../controllers/api/v2/posts_api');

router.get('/',postsAPI.index);

module.exports = router;