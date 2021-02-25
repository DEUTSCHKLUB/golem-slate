const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      router = express.Router();

// Get YAGNA STATUS
router.get("/ystatus/", async function(req, res, next) {
    try {
      let lookup = global.yagnaStatus;
      // set SSE headers
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
      });
      res.flushHeaders();
  
      res.write('retry: 5000\n\n');
  
      let interValID = setInterval(() => {
          res.write(`id: 1\n\n`);
          res.write(`data: ${lookup}\n\n`);
      }, 1000);
  
      res.on('close', () => {
          console.log('Yagna started');
          clearInterval(interValID);
          res.end();
      });
      
    } catch (error) {
      console.error(error);
      next(error);
    }
});

router.post("/ystatus/update/", function(req, res, next) {
    try {
    let status = req.params.ystatus;
      if(global.yagnaStatus == undefined) {
        res.status(400).send('Bad Request');
      } else {
        global.yagnaStatus.status = status;
        res.status(200).send(`YStatus is ${status}`);
      }
      
    } catch (error) {
      console.error(error);
      next(error);
    }
});

module.exports = router;