const update_check_fields = async (req, res, next) => {
   // Limpeza dos campos vazios do `req.body`
   req.body = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v != ''));

   let dataFiles = JSON.parse(req.body.dataFiles);
   let filesCreate = [];

   dataFiles.map( (element,index) => {
      if(element.file){
         dataFiles[index].path = req.body.thumbnails[index];
         filesCreate.push(dataFiles[index]);
      };
   });

   delete req.body.dataFiles;
   req.body.filesCreate = filesCreate;
   req.body.product_state = 'Enable';
   req.body.discounts = Number(req.body.discounts);
   req.body.profit_margin = Number(req.body.profit_margin);
   req.body.fees_and_taxes = Number(req.body.fees_and_taxes);
   
  return next();
};

module.exports = update_check_fields;
