const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      exampleCode = fs.readFileSync('./views/partials/example-code.txt', 'utf8'),
      // ash = require('express-async-handler'),
      formidable = require('formidable'),
      tree = require("directory-tree"),
      { spawn, exec, execFile } = require('child_process'),
      router = express.Router();

/* New Golpen landing page (no id provided) */
router.get('/', function(req, res, next) {
  res.render('slate', { title: 'Golem Slate', code: exampleCode });
});

/* FILE UPLOAD AND SAVE TO DISK ENDPOINT */

router.post("/upload", function(req, res) {
  const form = formidable({ multiples: true });

  // store all uploads in the /uploads directory
  form.uploadDir = `${ appRoot + '/files/' }`; 
  
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name),function (err) {
      if (err) throw err;
      // console.log('renamed complete');
    });
  }); 
  
  // log any errors that occur
  form.on('error', function(err) {
    console.log('A file upload error has occured: \n' + err);
  }); 
  
  // once all the files have been uploaded, send a JSON object back reading the file tree of the uploads
  // this way, in case we want to upload more files, we can just pass back a new scan to grab files
  form.on('end', function() {
    // res.end('success');
    // pass that object of files or method to scan folder...
    res.json(tree(form.uploadDir));
  }); 
  
  // parse the incoming request containing the form data
  form.parse(req);
});

/* RUN Form Route
   It's an async function that waits for certain data before posting the response
*/

router.post('/run', (req, res) => {
    /* destructuring the form body for use. You can now access
    them easily by using 'cpu' etc...and it will point to the form value */
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader("Content-Type", "text/event-stream");
    let { cpuSelect, ramSelect, discSelect, imageSelect } = req.body;

    const runner = spawn('sh', ['/home/derek/Desktop/golem-alpha3/yajsapi/examples/golem-codepen/disks/runPen.sh', 'diskOne', imageSelect, cpuSelect, ramSelect, discSelect]);
    runner.stdout.pipe(res, { end: false });
    runner.stderr.pipe(res, { end: false });
    runner.on('close', (code, signal) => {
      console.log(`child process exited with code ${code} and signal ${signal}`);
    });
});

module.exports = router;
