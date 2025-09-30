
const pu_check_fields = (req, res, next) => {

  req.body = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v != ''));
  
  return next();
};

module.exports = pu_check_fields;
