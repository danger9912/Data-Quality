const domainConsistencyServices = require('../services/domainConsistencyServices');
const fs = require('fs').promises;
const path = require('path');

exports.domainConsistencyAuto = async (req, res, next) => {
  try {
    const result = await domainConsistencyServices.domainConsistencyAuto(req.body);
    console.log(result);
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
exports.domainConfusionState = async (req, res, next) => {
  try {
    const result = await domainConsistencyServices.domainConfusionState(req);
    // console.log(result);
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
exports.domainRailwaysZones = async (req, res, next) => {
  try {
    const result = await domainConsistencyServices.domainRailwaysZones(req);
    // console.log(result);
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.domainConsistencyData = async (req, res, next) => {
  try {

    const filename = req.body.filename
    const filePath = path.join(__dirname, '../uploads', filename);
    const data = await fs.readFile(filePath, 'utf8');
    const jsonArray = JSON.parse(data);
    const result = await domainConsistencyServices.domainConsistencyData(jsonArray, req.body.attribute, req.body.datatype)
    console.log(result)
    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createDomainLogs = async (req, res, next) => {
  try {
    const domainData = req.body;
    const filePath = path.join(__dirname, '../uploads', domainData.filename);
    const data = await fs.readFile(filePath, 'utf8');
    const jsonArray = JSON.parse(data);
    const result = await domainConsistencyServices.createNewDomainLog(domainData, jsonArray);
    res.status(201).json({ message: 'Log entry created successfully' });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getDomainLogs = async (req, res, next) => {
  try {
    const result = await domainConsistencyServices.getDomainLogs();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};