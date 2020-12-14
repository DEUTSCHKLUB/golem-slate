var express = require('express');
var router = express.Router();

/* New Golpen landing page (no id provided) */
router.get('/', function(req, res, next) {
  res.render('golpen', { title: 'Golpen - The Web Editor for distributed computing' });
});

module.exports = router;
