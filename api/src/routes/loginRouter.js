const express = require('express');
const loginController = require('../controllers/loginController');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/', (req, res) => loginController.login(req, res, pool));

  return router;
};
