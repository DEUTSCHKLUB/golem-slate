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
    let { cpuSelect, ramSelect, discSelect, imageSelect } = req.body;

    const runner = spawn('sh', ['/home/derek/Desktop/golem-alpha3/yajsapi/examples/golem-codepen/disks/runPen.sh', 'diskOne', imageSelect, cpuSelect, ramSelect, discSelect]);
    runner.stdout.pipe(res, { end: false });
    runner.stderr.pipe(res, { end: false });
    runner.on('close', (code, signal) => {
      console.log(`child process exited with code ${code} and signal ${signal}`);
    });

    // res.setHeader("Content-Type", "text/event-stream");
    // res.setHeader("Cache-control", "no-cache");

    // let spw = cp.spawn('sh', [`${ appRoot + '/private/test.sh' }`]),
    //   str = "";

    // spw.stdout.on('data', function (data) {
    //     str += data.toString();

    //     // just so we can see the server is doing something
    //     console.log("data");

    //     // Flush out line by line.
    //     var lines = str.split("\n");
    //     for(var i in lines) {
    //         if(i == lines.length - 1) {
    //             str = lines[i];
    //         } else{
    //             // Note: The double-newline is *required*
    //             res.write('data: ' + lines[i] + "\n\n");
    //         }
    //     }
    // });

    // spw.on('close', function (code) {
    //     res.end(str);
    // });

    // spw.stderr.on('data', function (data) {
    //     res.end('stderr: ' + data);
    // });
    
});

module.exports = router;
