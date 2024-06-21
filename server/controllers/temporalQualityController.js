const temporalQualityServices = require('../services/temporalQualityServices');

exports.temporalVal = async (req, res, next) =>{
    try {
        const result = await temporalQualityServices.temporalVal(req.body);
        console.log(result);
        // res.json("hello");
        res.status(200).json({result});
      } catch (err) {
        console.error(err);
        next(err);
      }
};
exports.tempoConistency = async (req, res, next) =>{
    try {
        const result = await temporalQualityServices.tempoConistency(req.body.filename,req.body.attributes);
        // console.log(result);
        res.status(200).json({result});
      } catch (err) {
        console.error(err);
        next(err);
      }
};
exports.tempoValidity = async (req, res, next) =>{
    try {
        const result = await temporalQualityServices.tempoValidity(req.body.filename,req.body.attributes);
        // console.log(result);
        res.status(200).json({result});
      } catch (err) {
        console.error(err);
        next(err);
      }
};
exports.tempoStartend = async (req, res, next) =>{
    try {
        const result = await temporalQualityServices.tempoStartend(req.body.filename,req.body.attributes);
        // console.log(result);
        res.status(200).json({result});
      } catch (err) {
        console.error(err);
        next(err);
      }
};