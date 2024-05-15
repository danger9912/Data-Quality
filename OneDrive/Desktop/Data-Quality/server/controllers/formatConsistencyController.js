const formatServices = require('../services/formatConsistencyServices');

exports.createFormat = async (req, res, next) => {
  try {
    const format = req.body.format;
    const result = await formatServices.createFormat(format);
    res.status(201).json({formats: result});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getFormats = async (req, res, next) => {
  try {
    const result = await formatServices.getFormats();
    res.status(200).json({formats: result});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteFormat = async (req, res, next) => {
  try {
    const result = await formatServices.deleteFormat(req.params.id);
    res.status(200).json({ message: 'Format deleted successfully!!' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteAllFormats = async (req,res,next) => {
  try{
    const formatIds = req.body
 await formatServices.deleteAllFormats(formatIds);
res.status(200).json({ message: 'Formats selected deleted successfully!!'})
  }
  catch(err){
    console.error(err);
    next(err);
  }
}

exports.updateFormat = async(req,res,next) => {

  const formatId = req.params.id;
  const newSize = req.body.newSize;

  try{
await formatServices.updateMaxSize(formatId,newSize);
res.json({ success: true, message: 'Max size updated successfully.' });
  }
  catch(err){
    console.error(err);
    next(err);
  }
}

exports.checkPrimaryKeyFormat = async (req,res,next) => {

  const filename = req.body.filename
  const attributes = req.body.attributes

  try{
const result = await formatServices.checkPrimaryKeyFormat(filename,attributes);
res.status(201).json(result)
  } 
  catch(err){
    console.error(err);
    next(err);
  }
}

exports.checkForeignKeyFormat = async (req,res,next) => {
  const filename = req.body.filename
  const primary_key = req.body.primary_key
  const files = req.body.files
  
  try{

    if (!filename || !primary_key || !files || !Array.isArray(files)) {
      return res.status(400).json({ error: "Invalid request body" });
  }

const result = await formatServices.checkForeignKeyFormat(filename,primary_key,files)
res.status(201).json(result)
  } catch(err){
    console.error(err);
    next(err);
  }
}