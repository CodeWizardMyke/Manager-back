const {validationResult} = require('express-validator');
const removeFiles = require('../functions/removeUploadedFiles');

const pc_check_fields = async ( req, res, next ) => {
    const checkResult = validationResult(req);
    let errors  = null;
    
    if(!req.files || !req.files.length){
        let  e = [{path:'thumbnails',msg:'Nenuhma imag em do produto foi inserida!'}]
        return res.status(400).json(e)
    }

    if(!checkResult.isEmpty()){
        errors = checkResult
    }

    if(errors){
        removeFiles(req.files)
        return res.status(400).json(errors);
    }

    const {thumbnail_length, advertising_length, thumbnails } = req.body;
    let arrFormated = []

    let arrayThumbnail = thumbnails.slice(0,thumbnail_length);
    arrayThumbnail.forEach( element => {
        let itemString = {
            locail:element,
            isAdvertising:0
        };
        arrFormated.push(itemString)
    });

    let arrayAdvertising = thumbnails.slice( thumbnail_length , Number(advertising_length) + Number(thumbnail_length) );
    arrayAdvertising.forEach(element => {
        let itemString = {
            locail:element,
            isAdvertising:1
        };
        arrFormated.push(itemString)
    });
    
    req.body.thumbnails = JSON.stringify(arrFormated)
    req.body.product_state = 'E'
    req.body.discounts = Number(req.body.discounts)
    req.body.profit_margin = Number(req.body.profit_margin)
    req.body.fees_and_taxes = Number(req.body.fees_and_taxes)
    
    return next();
};

module.exports = pc_check_fields;
