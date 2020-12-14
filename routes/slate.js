const express = require('express'),
      fs = require('fs'),
      exampleCode = fs.readFileSync('./views/partials/example-code.txt', 'utf8'),
      router = express.Router();

/* New Golpen landing page (no id provided) */
router.get('/', function(req, res, next) {
  res.render('slate', { title: 'Golem Slate', code: exampleCode });
});

module.exports = router;
