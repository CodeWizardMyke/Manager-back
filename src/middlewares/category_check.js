const { validationResult }  = require('express-validator');

const category_check =  (req, res, next) => {
    const checked = validationResult(req);
    if(checked.errors.length){
        console.log('checked.errors.length', checked.errors.length);
        return res.status(401).json(checked.errors);
    }
    return next();
};

module.exports = category_check;
