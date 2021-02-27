const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      // ash = require('express-async-handler'),
      tree = require("directory-tree"),
      { spawn, exec, execFile } = require('child_process'),
      shortid = require('shortid'),
      router = express.Router();

let penSlot = -1;

const excludePaths =  [/lost\+found/, /node_modules/, /init\.sh/, /run\.sh/, /tsconfig\.json/, /yarn\.lock/, /tsconfig\.json/, /package\.json/];

/* New Golpen landing page (no id provided) */
router.get('/:slateid', function(req, res, next) {
  try {
    let slateid = req.params.slateid;
    console.log(`Current slate ID: ${slateid}`);
    
    let penSlot = global.penHashes[slateid];

    if (penSlot == undefined) { 
      console.log("invalid slate id");
      res.redirect("/");
    }

    fileDir = `./pens/pen${penSlot}/`,

    res.render('slate', { title: `Golem Slate`, code: 'Upload files by dragging them in the box to the left. Click the file name in the list to open it in this editor.', files: tree(fileDir, {exclude: excludePaths}), slate: slateid });
  } catch (err) {
    console.log(err);
    next(err);
  }
  
});

/* RUN Form Route */

router.post('/run/:slateid', (req, res, next) => {
  try {
    /* destructuring the form body for use. You can now access
    them easily by using 'cpu' etc...and it will point to the form value */
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader("Content-Type", "text/event-stream");
    let { cpuSelect, ramSelect, discSelect, imageSelect } = req.body;

    // Refresh expiry
    let slateid = req.params.slateid;
    global.penExpires[global.penHashes[slateid]] = Date.now() + global.penDuration * 60 * 1000; //global.penDuration

    console.log(`Current slate ID: ${slateid}`);
    
    let penSlot = global.penHashes[slateid];

    if (penSlot == undefined) { 
      console.log("invalid slate id");
      res.redirect("/");
    }

    imageSelect = imageSelect.replace(/[^a-zA-Z0-9]/g, "");

    const runner = spawn('sh', ['./pens/runPen.sh', `pen${penSlot}`, imageSelect, cpuSelect, ramSelect, discSelect]);
    runner.stdout.pipe(res, { end: false });
    runner.stderr.pipe(res, { end: false });
    runner.on('close', (code, signal) => {
      console.log(`child process exited with code ${code} and signal ${signal}`);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
    
});

/* STOP Pen Route */

router.get('/stop/:slateid', (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Content-Type", "text/event-stream");

    let slateid = req.params.slateid;
    console.log(`Stopping slate ID: ${slateid}`);
    
    let penSlot = global.penHashes[slateid];

    if (penSlot == undefined) { 
      console.log("invalid slate id");
      res.redirect("/");
    }

    const runner = spawn('sh', ['./pens/restartPen.sh', `pen${penSlot}`]);
    runner.stdout.pipe(res, { end: false });
    runner.stderr.pipe(res, { end: false });
    runner.on('close', (code, signal) => {
      console.log(`child process exited with code ${code} and signal ${signal}`);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
    
});

/* RESET Pen Route */

router.get('/reset/:slateid', (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Content-Type", "text/event-stream");

    let slateid = req.params.slateid;
    console.log(`Resetting slate ID: ${slateid}`);
    
    let penSlot = global.penHashes[slateid];

    if (penSlot == undefined) { 
      console.log("invalid slate id");
      res.redirect("/");
    }

    const runner = spawn('sh', ['./pens/resetPen.sh', `pen${penSlot}`]);
    runner.stdout.pipe(res, { end: false });
    runner.stderr.pipe(res, { end: false });
    runner.on('close', (code, signal) => {
      console.log(`child process exited with code ${code} and signal ${signal}`);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
    
});

module.exports = router;
