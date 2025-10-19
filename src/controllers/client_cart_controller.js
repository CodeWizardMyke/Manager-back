const { Cart, Cart_item, Client } = require('../database/models');

const client_cart_controller = {
  get_pending: async (req, res) => {
   try {
    const {id} = req.params
    const dataCart = [];

    const client = await Client.findByPk(id)

    const cart  = await Cart.findAndCountAll({
      where:{fk_client_id:id, state: "pendding"}
    })

    for( const item of cart.rows ){
      const response = await Cart_item.findAll({where:{fk_cart_id: item.cart_id}, include:'product'})
      dataCart.push(response)
    }
    res.send({client:client, cart:dataCart})
   } catch (error) {
    console.log('error', error);
    return res.status(500).json(error)
   }
  }
}

module.exports = client_cart_controller;