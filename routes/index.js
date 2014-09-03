var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '아헿헤헤헿', random_users:[], picked_users:[] });
});

module.exports = router;
