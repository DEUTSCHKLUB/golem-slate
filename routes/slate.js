const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      exampleCode = fs.readFileSync('./views/partials/example-code.txt', 'utf8'),
      ash = require('express-async-handler'),
      { spawn, exec, execFile } = require('child_process'),
      router = express.Router();

/* New Golpen landing page (no id provided) */
router.get('/', function(req, res, next) {
  res.render('slate', { title: 'Golem Slate', code: exampleCode });
});

/* RUN Form Route
   It's an async function that waits for certain data before posting the response
   This is where we can make the socket for the terminal and return it to the view I'm hoping.
*/

router.post('/run/', (req, res) => {
    /* destructuring the form body for use. You can now access
    them easily by using 'cpu' etc...and it will point to the form value */
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader("Content-Type", "text/event-stream");
    let { cpuSelect, ramSelect, discSelect, imageSelect } = req.body;

    const runner = spawn('sh', [`${ appRoot + '/private/test.sh' }`,cpuSelect, ramSelect, discSelect, imageSelect]);
    runner.stdout.pipe(res, { end: false });
    runner.stderr.pipe(res, { end: false });
    runner.on('close', (code, signal) => {
      console.log(`child process exited with code ${code} and signal ${signal}`);
    });
});

module.exports = router;
