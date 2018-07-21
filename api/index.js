

var express = require('express');
var router = express.Router();

var get = require('./get');
var post = require('./post');
var patch = require('./patch');
var remove = require('./delete');

router.use(get);
router.use(post);
router.use(patch);
router.use(remove);

module.exports = router;
