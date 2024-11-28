/*This is a test-router supposed to illustrate how a router module is set up*/
const router = require('express').Router();

router.get('/test-file', (req, res) => {
  res.send('test-ok');
});
router.post('/test-file', (req, res) => {
  res.send('test-ok');
});

//This always has to be at the end of the file 
module.exports = router;