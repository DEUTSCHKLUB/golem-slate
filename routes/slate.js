const express = require('express'),
      fs = require('fs'),
      exampleCode = fs.readFileSync('./views/partials/example-code.txt', 'utf8'),
      ash = require('express-async-handler'),
      router = express.Router();

// Functions

// This is just to simulate some lag to the terminal...I wanted to see what the await bit would act like:

function formatOutput (cpu,ram,disc,img){
  let output = [];
  for(let a in arguments){
    output.push(` ${a}: ${arguments[a]} `);
  }
  return new Promise((resolve, reject) => {
       setTimeout(() => {
          resolve(output.join(","));
       }, 1000);
  });
}

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
    const { cpuSelect, ramSelect, discSelect, imageSelect } = req.body;
    /* This is where we can use it to call and await the results before sending the result */
    const ret = await formatOutput(cpuSelect, ramSelect, discSelect, imageSelect);
    res.send(ret);
}))

module.exports = router;
