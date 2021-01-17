const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      formidable = require('formidable'),
      tree = require("directory-tree"),
      { spawn, exec, execFile } = require('child_process'),
      isTextPath = require('is-text-path'),
      router = express.Router();
      

/* GET CURRENT FILE LIST with a GET request, returns JSON to parse */

const excludePaths =  [/lost\+found/, /node_modules/, /init\.sh/, /run\.sh/, /tsconfig\.json/, /yarn\.lock/, /tsconfig\.json/, /package\.json/];

function GetFilePath(req) {
  let slateid = req.params.slateid;
  console.log(`Current slate ID: ${slateid}`);
  
  let penSlot = global.penHashes[slateid];

  
  if (penSlot == undefined) { 
    throw Error("Invalid pen slot!");
  }

  return `./pens/pen${penSlot}/`;
}

router.get("/:slateid/tree", function(req, res) {
  let treeResults = tree(GetFilePath(req), {exclude: excludePaths});
  // console.log(JSON.stringify(treeResults));
  res.json(treeResults);
});

/* FILE UPLOAD AND SAVE TO DISK ENDPOINT */

router.post("/:slateid/upload", function(req, res) {
  const form = formidable({ multiples: true });

  // store all uploads in the /files directory
  form.uploadDir = GetFilePath(req); 
  
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
    setTimeout((function() {res.json(tree(form.uploadDir, {exclude: excludePaths}))}), 800);
  }); 
  
  // parse the incoming request containing the form data
  form.parse(req);
});

/* OPEN FILE IN EDITOR ENDPOINT */

router.get("/:slateid/:file", function(req, res) {
    let p = path.join(GetFilePath(req), req.params.file);
    if (fs.existsSync(p)) {
        let readStream = fs.createReadStream(p);

        readStream.on('error', function(error) {
            res.send(`Error: ${error}`);
        });

        readStream.pipe(res);
    }else{
        res.end(`Could Not Load ${req.params.file}`);
    }
});

/* DOWNLOAD ENDPOINT */

router.get("/:slateid/download/:file", async function(req, res, next) {
  let p = path.join(GetFilePath(req), req.params.file);
  try {
    res.download(p, req.params.file, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });

  } catch (error) {
    res.status(500).send({
      message: "Could not download the file. " + err,
    });
  }
});

/* SAVE FILE FROM EDITOR ENDPOINT */

router.post("/:slateid/save", function(req, res) {    
    let f = req.body.file,
        p = path.join(GetFilePath(req), f),
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