const {validationResult} = require('express-validator');

const cc_check_fields = async ( req, res, next ) => {

    const checkResult = validationResult(req);

    if(checkResult.errors.length){
        console.log(checkResult.errors)
        return res.status(401).json(checkResult.errors);
    }

    let {itemsInCart} = req.body;

    if(!itemsInCart.length){
        return res.status(401).json({erros:[{ path:itemsInCart, msg:"nenhum item foi adicionado ao carrinho!!" }]});
    }

   return next();
};

module.exports = cc_check_fields;
