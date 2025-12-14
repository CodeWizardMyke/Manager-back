const update_check_fields = async (req, res, next) => {
   if( req.body.product_id == '' || req.body.product_id == undefined){
      return res.status(400).json({msg: "product_id is required"});
   }

   req.body = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v != ''));

   req.body.product_state = 'Enable';
   req.body.discounts = Number(req.body.discounts);
   req.body.profit_margin = Number(req.body.profit_margin);
   req.body.fees_and_taxes = Number(req.body.fees_and_taxes);

   return next();
};

module.exports = update_check_fields;
