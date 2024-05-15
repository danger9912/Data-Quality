const comissionServices = require('../services/comissionServices');

exports.createOmissionLogs = async (req, res, next) => {
    try {
        const comissionData = req.body;
        const result = await comissionServices.createNewComissionLog(comissionData);
        res.status(201).json({ message: 'Log entry created successfully' });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.getOmissionLogs = async (req, res, next) => {
    try {
        const result = await comissionServices.getComissionLogs();
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.deleteOmissionLogs = async (req, res, next) => {
    try {
        const result = await comissionServices.deleteExistingComissionLog(req.params.id);
        res.status(200).json({ message: 'Log deleted successfully!!' });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.deleteAllComissionLogs = async (req,res,next) => {
    try{
      const ComissionIds = req.body
   await comissionServices.deleteAllComissionLogs(ComissionIds);
  res.status(200).json({ message: 'Comission Logs selected deleted successfully!!'})
    }
    catch(err){
      console.error(err);
      next(err);
    }
  }

