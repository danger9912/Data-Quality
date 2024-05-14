const dateFormatServices = require('../services/dateFormatService');

exports.checkDateFormat = async (req, res, next) => {
    try {
        console.log(req.body);
        const result = await dateFormatServices.checkDateFormat(req.body.filename, req.body.attributes);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};
