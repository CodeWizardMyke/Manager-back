const {validationResult} = require('express-validator');

const cc_check_fields = async ( req, res, next ) => {
  const checkResult = validationResult(req);
  if (!checkResult.isEmpty()) {
    return res.status(409).json(checkResult);
  }

  return next();  
};

module.exports = cc_check_fields;
