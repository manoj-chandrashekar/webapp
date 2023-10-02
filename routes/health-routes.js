const express = require('express');
const router = express.Router();

const healthController = require('../controllers/health-controller');

router.get('/', healthController.checkConnection);

router.use('/', healthController.otherMethods);

module.exports = router;