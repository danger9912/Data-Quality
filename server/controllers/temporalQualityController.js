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