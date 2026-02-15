const {validationResult} = require('express-validator');
const {Client} = require('../database/models')

const clientFilterFields = async (req, res, next) => {

    const result = validationResult(req);
    console.log(result);

    if(!result.isEmpty()){
        return res.status(400).json(result);
    };

    const {clientInstagram} = req.body;
    
    if(clientInstagram){
        const clientResult = await Client.findOne({ where: { clientInstagram: clientInstagram } });
        if(clientResult){
           return res.status(400).json({errors:[{path:'clientInstagram',msg:"Este Cliente já foi cadastrado no sistema!"}]});
        }
    }

    return next();
};

module.exports = clientFilterFields;