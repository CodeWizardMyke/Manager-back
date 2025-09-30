
const prod_price_convert = (req, ) => {
    const {price, originam_price, sale_price, promotions} = req.body;

    const err = {errors:[]};

    if(!price ||!originam_price ||!sale_price ||!promotions){
        err.errors.push({path:'price',msg:'Preencha todos de precificação os campos!'});
    }

    if(price !== Number) req.body.price = Number(price);
    if(originam_price !== Number) req.body.originam_price = Number(originam_price);
    if(sale_price !== Number) req.body.sale_price = Number(sale_price);
    if(promotions !== Number) req.body.promotions = Number(promotions);

    if( price !== Number || originam_price!== Number || sale_price !== Number || promotions!== Number ){
        err.errors.push({path:'price',msg:'Os campos de precifcação tem que ser numérico'});
        return err
    }
}

module.exports = prod_price_convert;
