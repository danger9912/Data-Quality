const accuracyNumberServices= require('../services/accuracyNumberServices');

exports.getallcols = async (req, res, next) => {
    try {
        // console.log(req.body)
        // const getcols = req.body;
        const result = await accuracyNumberServices.getcols(req.body.filename, req.body.attributes);
    //  console.log(result)
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
exports.insertData = async(req,res,next)=>{
    try{
        const result = await accuracyNumberServices.createNewAccuracyMeasurementLog(req.body);
        res.status(200).json(result)
    }
    catch(err){
        console.log(err);
        next(err);
    }
}
exports.getAccuracy_measure = async (req, res, next) => {
    try {
        const result = await accuracyNumberServices.getAccuracylogs();
        // console.log(result)
        res.json(result);

    } catch (err) {
        console.log(err);
        next(err);
    }
};