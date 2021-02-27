const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      fileDir = './pens/pen1/',
      { spawn, exec, execSync, execFile } = require('child_process'),
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
    } else if(global.penExpires[index] != undefined) {
      let expiresAt = global.penExpires[index];
      let currentTime = Date.now();
      console.log(`Pen ${index} expires ${expiresAt} and it is ${currentTime}`);
      if (global.penExpires[index] < currentTime) { // If it has expired
        // Now we need to clear out the pen and return the number
        console.log(`clearing slot ${index}`);

        // Don't need to show the output while resetting
        execSync(`./pens/resetPen.sh pen${index}`);

        return index;
      } else {
        console.log(`Can't use slot ${index}`);
      }
    }
  }

  // If we got here then it means we have no available slots so we can try to clear one up



  return -1;
}

router.get('/instances/:code', (req, res, next) => {
  try {
    let password = req.params.code;

    let checkPass = process.env.SLATE_PASS;

    if(password != checkPass) {
      next();
      return;
    }

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
      res.write(`\nCurrent Time: ${Date.now()}\n`);
      res.write('\nPen status:\n');
      for (let index = 0; index < global.maxPens; index++) {
        res.write(`Slot ${index} = ${global.penSlots[index]}\t${global.penExpires[index]}\n`);
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
        global.penExpires[openSlot] = Date.now() + 30 * 60 * 1000; // Timeout after 3 minutes
  
        res.redirect(`/s/${newPenId}`);
      };

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
