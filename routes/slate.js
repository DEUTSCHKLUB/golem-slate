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

router.post('/run/', ash(async(req, res) => {
    /* destructuring the form body for use. You can now access
    them easily by using 'cpu' etc...and it will point to the form value */
    let { cpuSelect, ramSelect, discSelect, imageSelect } = req.body;
    // Trying to get a local file read and run. It kept returning a syntax error on the shell script and I'm tired for tonight...
    // You can pass arguments in the array, then it expects a callback function with the data.
    
    /*
    const runner = execFile(appRoot('/private/test.sh'), [cpuSelect, ramSelect, discSelect, imageSelect], (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      runner.stdout.pipe(res, { end: false });
    });
    */

    // Testing with a simple PING 
    const runner = spawn('ping', ['www.google.com']);

    runner.stdout.pipe(res, { end: false });

    runner.on('exit', function() {
      process.exit()
    });
}))

module.exports = router;
