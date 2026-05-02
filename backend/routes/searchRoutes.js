const express = require('express');
const router = express.Router();
const { searchPosts } = require('../controllers/searchController');

router.get('/', searchPosts);

module.exports = router;
