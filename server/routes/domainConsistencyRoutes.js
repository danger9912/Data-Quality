const domainConsistencyController = require('../controllers/domainConsistencyController');
const express = require('express');
const router = express.Router();

router.post('/domain-auto', domainConsistencyController.domainConsistencyAuto);
router.post('/domain-data',domainConsistencyController.domainConsistencyData);
router.get('/domain-log',domainConsistencyController.getDomainLogs);
router.post('/domain-log', domainConsistencyController.createDomainLogs);
router.post('/domain-confusion', domainConsistencyController.domainConfusionState);
router.post('/domain-railwayZones', domainConsistencyController.domainRailwaysZones);


module.exports = router;