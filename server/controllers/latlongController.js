const unionTerrServices= require('../services/unionTerrServices');
exports.check = async (req, res, next) => {
    try {
        console.log(req.body)
        // const getcols = req.body;
        const result = await unionTerrServices.SelectedCode(req.body.filename,req.body.attributes);
    //  console.log(result)
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
exports.insertData = async (req, res, next) => {
    try {
        console.log(req.body)
        // const getcols = req.body;
        const result = await unionTerrServices.createLog(req.body);
    //  console.log(result)
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
exports.getLogs = async (req, res, next) => {
    try {
        // console.log(req.body)
        // const getcols = req.body;
        const result = await unionTerrServices.getlogs();
    //  console.log(result)
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
// exports.viewFile = async (req, res, next) => {
//     try {
//         // console.log(req.body)
//         // const getcols = req.body;
//         const result = await stationService.viewFile(req.body);
//     //  console.log(result)
//         res.status(200).json(result);
//     } catch (err) {
//         console.log(err);
//         next(err);
//     }
// };