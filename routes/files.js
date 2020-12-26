const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      fileDir = './files/',
      formidable = require('formidable'),
      tree = require("directory-tree"),
      { spawn, exec, execFile } = require('child_process'),
      router = express.Router();

/* GET CURRENT FILE LIST with a GET request, returns JSON to parse */

router.get("/tree", function(req, res) {
    res.json(tree(fileDir));
});

/* FILE UPLOAD AND SAVE TO DISK ENDPOINT */

router.post("/upload", function(req, res) {
  const form = formidable({ multiples: true });

  // store all uploads in the /files directory
  form.uploadDir = fileDir; 
  
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
    setTimeout((function() {res.json(tree(form.uploadDir))}), 800);
  }); 
  
  // parse the incoming request containing the form data
  form.parse(req);
});

/* OPEN FILE IN EDITOR ENDPOINT */

router.get("/:file", function(req, res) {
    let p = path.join(fileDir, req.params.file);
    if (fs.existsSync(p)) {

        let readStream = fs.createReadStream(p);

        readStream.on('error', function(error) {
            res.send(`Error: ${error}`);
        });

        readStream.pipe(res);
    }else{
        res.end("Could Not Load File");
    }
});

/* SAVE FILE FROM EDITOR ENDPOINT */

router.post("/save", function(req, res) {    
    let f = req.body.file,
        p = path.join(fileDir, f),
        content = req.body.content,
        ws = fs.createWriteStream(p);

    ws.on('error', function(error) {
        res.send('Could not save file');
    });

    ws.write(content);
    ws.end();

    res.end('File saved!');
    // respond with file tree data to rebuild list just in case there are changes
    // res.json(tree(fileDir));
});

module.exports = router;