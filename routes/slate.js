const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      // ash = require('express-async-handler'),
      fileDir = './pens/pen1/',
      tree = require("directory-tree"),
      { spawn, exec, execFile } = require('child_process'),
      router = express.Router();

/* New Golpen landing page (no id provided) */
router.get('/', function(req, res, next) {
  res.render('slate', { title: 'Golem Slate', code: 'Upload files by dragging them in the box to the left. Click the file name in the list to open it in this editor.', files: tree(fileDir) });
});

/* RUN Form Route */

router.post('/run', (req, res) => {
    /* destructuring the form body for use. You can now access
    them easily by using 'cpu' etc...and it will point to the form value */
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader("Content-Type", "text/event-stream");
    let { cpuSelect, ramSelect, discSelect, imageSelect } = req.body;

    imageSelect = imageSelect.replace(/[^a-zA-Z0-9]/g, "");

    const runner = spawn('sh', ['./pens/runPen.sh', 'pen1', imageSelect, cpuSelect, ramSelect, discSelect]);
    runner.stdout.pipe(res, { end: false });
    runner.stderr.pipe(res, { end: false });
    runner.on('close', (code, signal) => {
      console.log(`child process exited with code ${code} and signal ${signal}`);
    });
});

module.exports = router;
