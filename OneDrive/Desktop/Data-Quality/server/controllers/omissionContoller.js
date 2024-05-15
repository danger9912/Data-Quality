const omissionServices = require('../services/omissionServices');

exports.omissionAuto = async (req, res, next) => {
    try {
        const result = await omissionServices.omissionAuto(req.body.filename, req.body.attributes);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.createOmissionLogs = async (req, res, next) => {
    try {
        const omissionData = req.body;
        const result = await omissionServices.createNewOmissionLog(omissionData);
        res.status(201).json({ message: 'Log entry created successfully' });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.getOmissionLogs = async (req, res, next) => {
    try {
        const result = await omissionServices.getOmissionLogs();
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.deleteOmissionLogs = async (req, res, next) => {
    try {
        const result = await omissionServices.deleteExistingOmissionLog(req.params.id);
        res.status(200).json({ message: 'Log deleted successfully!!' });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.deleteAllOmissionLogs = async (req,res,next) => {
    console.log(req.body);
    try{
      const OmissionIds = req.body
   await omissionServices.deleteAllOmissionLogs(OmissionIds);
  res.status(200).json({ message: 'Omission Logs selected deleted successfully!!'})
    }
    catch(err){
      console.error(err);
      next(err);
    }
  }

