const {Cart, Cart_item, Product} = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');

const Cart_crud_controller = {
  create: async (req, res) => {
    try {
      //creating base structure of the cart
      const objectCart = {
        amount:0,
        qtd_products:0,
        state:'pendding',
        fk_client_id: req.body.client_id
      }

      const {items} = req.body;

      //scrolling through all items in the cart
      for( const item of items ){
        const product = await Product.findByPk(item.product_id);

        //update objectCart structure data
        objectCart.qtd_products += item.qtd_products ;
        objectCart.amount += Number(product.selling_price) * item.qtd_products;
      }

      const dataCartCreated = await Cart.create(objectCart)

      for( const item of items){
        //Now add all the products listed by the user to the cart_item table
        await Cart_item.create({
          fk_cart_id:    dataCartCreated.cart_id,
          fk_product_id: item.product_id,
          qtd_products:  item.qtd_products
        })
      }

      return res.status(201).json(dataCartCreated);

    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  read:  async (req, res) => {
    try {
      const {page, size} = paginateDefine(req);
      let {client_id,state} = req.headers;

      const data = await Cart.findAndCountAll({
        where:{
          fk_client_id:client_id,
          state: state ? state : 'pendding' 
        },
        limit: size,
        offset: size * (page - 1),
      })

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  update: async (req, res) => {
    try {
      const {cart_id} = req.headers;
      const data = await Cart.findByPk(cart_id);
      await data.update(req.body);
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  delete: async (req, res) => {
    try {
      const {cart_id} = req.headers;
      
      //search for cart based on id
      const cartData = await Cart.findOne({
        where:{
          cart_id: cart_id,
          state: 'pendding'
        }
      });

      //If nothing is found then return a message
      if(!cartData){
        return res.status(401).json({
          message: 'Carrinho inesistente ou com pagamento já aprovado!'
        });
      }

      //We search for all the items that were separated in the cart
      const cartItemData = await Cart_item.findAll({
        where:{
          fk_cart_id:cart_id
        }
      });

      //We iterate over all items found
      for(const item of cartItemData){
        await item.destroy();
      }
      //delete own cart
      await cartData.destroy();

      return res.json({successful:{msg:"o carrinho foi deletado com sucesso!"}});
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    } 
  }
};

module.exports = Cart_crud_controller;