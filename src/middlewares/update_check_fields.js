const update_check_fields = async (req, res, next) => {
   // Limpeza dos campos vazios do `req.body`
   req.body = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v != ''));

   let filesCreate = [];

   let dataFiles = JSON.parse(req.body.dataFiles);
   dataFiles.map( (element) => { if(element.file){ filesCreate.push(element); } });

   filesCreate.map((element,index) => {
      element.path = req.body.thumbnails_uniqueSuffix[index]
   })
   
   delete req.body.dataFiles;
   req.body.filesCreate = filesCreate;
   req.body.product_state = 'Enable';
   req.body.discounts = Number(req.body.discounts);
   req.body.profit_margin = Number(req.body.profit_margin);
   req.body.fees_and_taxes = Number(req.body.fees_and_taxes);
   
   return next();
};

module.exports = update_check_fields;
