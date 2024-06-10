const checkAllFeildsServices= require('../services/checkAllFeildsServices');
exports.getlatlong = async (req, res, next) => {
    try {
        console.log(req.body)
        const result = await checkAllFeildsServices.getlatlong(req.body.filename,req.body.attributes);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};