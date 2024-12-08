const {Thumbnails} = require('../database/models')


const {validationResult} = require('express-validator');
const removeFiles = require('../functions/removeUploadedFiles');

const pc_check_fields = async ( req, res, next ) => {
    const checkResult = validationResult(req);
    let errors  = null;

    if(!req.files || !req.files.length){
        let  e = [{path:'thumbnails',msg:'Nenuhma imag em do produto foi inserida!'}]
        return res.status(400).json({errors:e})
    }

    if(!checkResult.isEmpty()){
        errors = checkResult
    }

    if(errors){
        removeFiles(req.files)
        return res.status(400).json(errors);
    }
    
    req.body.product_state = 'Enable'
    req.body.discounts = Number(req.body.discounts)
    req.body.profit_margin = Number(req.body.profit_margin)
    req.body.fees_and_taxes = Number(req.body.fees_and_taxes)
    
    return next();
};

module.exports = pc_check_fields;
;