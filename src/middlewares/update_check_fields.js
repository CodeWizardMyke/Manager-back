const update_check_fields = async (req, res, next) => {
   if( req.body.product_id == '' || req.body.product_id == undefined){
      return res.status(400).json({msg: "product_id is required"});
   }
   const thumbnails_length = Number(req.body.thumbnails_length);
   const advertising_length = Number(req.body.advertising_length);

   console.log(req.body)

   // filtrando campos vazios do request
   req.body = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v != ''));

   if(thumbnails_length > 0 || advertising_length > 0){
      let instanceFiles = [];
      if(thumbnails_length > 0){
         instanceFiles = instanceFiles.concat(req.files.slice(0, thumbnails_length));
      }
      if(advertising_length > 0){
         instanceFiles = instanceFiles.concat(req.files.slice(thumbnails_length, thumbnails_length + advertising_length));
      }
      if(instanceFiles.length > 0){
         req.filesCreate = instanceFiles;
      }
   }
   
   delete req.body.dataFiles;

   req.body.product_state = 'Enable';
   req.body.discounts = Number(req.body.discounts);
   req.body.profit_margin = Number(req.body.profit_margin);
   req.body.fees_and_taxes = Number(req.body.fees_and_taxes);
   
   return next();
};

module.exports = update_check_fields;
