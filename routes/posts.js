const router = require('express').Router();

router.get('/', (req, res) => {
  res.send(true);
});

module.exports = router;