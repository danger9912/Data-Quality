const pincodeServices = require("../services/PincodeformateServices");

exports.pincodeAuto = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await pincodeServices.pincodeAuto(
      req.body.filename,
      req.body.attributes
    );
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createPincodeLogs = async (req, res, next) => {
  try {
    const pincodeData = req.body;
    const result = await pincodeServices.createNewPincodeLog(pincodeData);
    res.status(201).json({ message: "Log entry created successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getPincodeLogs = async (req, res, next) => {
  try {
    const result = await omissionServices.getPincodeLogs();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

