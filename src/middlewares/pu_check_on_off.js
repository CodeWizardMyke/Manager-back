
const pu_check_on_off = (req, res, next) => {
  const {use_thumbnail,catalog_listing,discounts} = req.body;

  if(!use_thumbnail || use_thumbnail !== 'on') req.body.thumbnail = 'off';
  if(!catalog_listing || catalog_listing !== 'on') req.body.catalog_listing = 'off';
  if(!discounts || discounts !== 'on') req.body.discounts = 'off';

  return next();
}

module.exports = pu_check_on_off;