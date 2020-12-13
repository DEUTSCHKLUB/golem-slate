var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('golpen', { title: 'Golpen - The Web UI for distributed computing' });
});

module.exports = router;
