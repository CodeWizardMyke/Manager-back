const {check} = require('express-validator');

const pc_sweep_fields = [
  check('fk_brand_id').notEmpty().withMessage('Marca não defina!').isNumeric().withMessage('Formato inccoreto de dado').trim(),
  check('fk_category_id').notEmpty().withMessage('Categoria não defina!').isNumeric().withMessage('Formato inccoreto de dado').trim(),
  check('title').notEmpty().withMessage('Insira um título para o produto!').trim(),
  check('discribe').notEmpty().withMessage('De uma descriçã do produto!').trim(),
  check('product_cost').notEmpty().withMessage('Defina o preço de custo').isNumeric().withMessage('Formato inccoreto de dado').trim(),
  check('selling_price').notEmpty().withMessage('Defina o preço de venda').isNumeric().withMessage('Formato inccoreto de dado').trim(),
  check('profit_margin').notEmpty().withMessage('Informe sua margem de lucro').isNumeric().withMessage('Formato inccoreto de dado').trim(),
  check('NET_VOLUM').notEmpty().withMessage('O volume do produto deve ser informado').trim(),
  check('stock').notEmpty().withMessage('Quantidade em estoque não definido').isNumeric().withMessage('Formato inccoreto de dado').trim(),
]

module.exports = pc_sweep_fields;
