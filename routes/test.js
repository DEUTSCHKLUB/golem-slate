const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      fileDir = './pens/pen1/',
      { spawn, exec, execFile } = require('child_process'),
      shortid = require('shortid'),
      router = express.Router();

/* New Golpen landing page (no id provided) */
router.get('/', function(req, res, next) {
  try {
    res.write("Testing area...");
    res.write("Current Pens:");
    res.write(JSON.stringify(global.pens));
    res.end();
  } catch (err) {
    console.log(err);
    next(err);
  }
  
});

/* Get Docker Image Count */
function GetDockerCount(callbacksSuck) {
  
  exec("docker ps --format '{{.Names}}'", (error, stdout, stderr) => { 
    if (error) { 
      console.log(`exec error: ${error}`); 
      return error; 
    } 
    
    if (stderr!= "") {
      console.log(`stderr: ${stderr}`); 
    }

    callbacksSuck(stdout);
  });
}

// Returns the 0-based slot number of an available pen, or -1 if no pen slots are available
function GetAvailablePenSlot() {
  for (let index = 0; index < global.maxPens; index++) {
    if (global.penSlots[index] == "") {
      return index;
    }
  }
  return -1;
}

router.get('/instances', (req, res, next) => {
  try {
    GetDockerCount((result) => {
      res.write("Docker instances:\n")
      let resultArray = result.split("\n");
      res.write(result);
      res.write('\n');
      if(resultArray.length >= global.maxPens) {
        res.write('There are too many pens already!');
      } else {
        res.write('You may have a new pen\n');
      }
      res.write('\nPen status:\n');
      for (let index = 0; index < global.maxPens; index++) {
        res.write(`Slot ${index} = ${global.penSlots[index]}\n`);
      }
      
      res.end();
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
    
});

router.get('/instances/create', (req, res, next) => {
  try {
    let openSlot = GetAvailablePenSlot();
    console.log("Received open slot: " + openSlot);
    
    if (openSlot == -1) {
      res.write("No pens available! Sorry, Charlie!");
      res.end();
    } else {
      let newPenId = shortid.generate();
      // Store both dictionaries so we can look it up either way
      global.penSlots[openSlot] = newPenId;
      global.penHashes[newPenId] = openSlot;

      res.redirect(`/s/${newPenId}`);
    }

    /*
    GetDockerCount((result) => {
      let resultArray = result.split("\n");
      res.write(result);
      // This count is off by 1. when I have 2 running it says 3?
      res.write(`${resultArray.length}/${global.maxPens} pens in use`);
      if(resultArray.length >= global.maxPens) {
        res.write('There are too many pens already!');
      } else {
        res.write('You may have a new pen');
      }
      
      res.end();
    });
    */
  } catch (err) {
    console.log(err);
    next(err);
  }
    
});

module.exports = router;
