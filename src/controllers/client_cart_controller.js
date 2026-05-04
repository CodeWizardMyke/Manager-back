const { Cart, Cart_item, Client, Product } = require('../database/models');

const client_cart_controller = {

  get_pending: async (req, res) => {

    try {

      const { id } = req.params;

      const { employee_id } = req.token_decoded;

      /*
        Verifica se o client pertence ao usuário
      */
      const client = await Client.findOne({

        where:{
          client_id: id,
          owner_employee_id: employee_id
        }

      });

      if(!client){

        return res.status(403).json({
          error:'Cliente não pertence a este usuário.'
        });

      }

      /*
        Busca carrinhos pendentes
      */
      const carts = await Cart.findAndCountAll({

        where:{
          fk_client_id: id,
          state: 'pendding'
        }

      });

      /*
        Monta resposta com itens
      */
      const dataCart = [];

      for(const cart of carts.rows){

        const items = await Cart_item.findAll({

          where:{
            fk_cart_id: cart.cart_id
          },

          include:[
            {
              model: Product,
              as: 'product'
            }
          ]

        });

        dataCart.push({
          cart,
          items
        });

      }

      return res.json({
        client,
        carts: dataCart
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json(error);

    }

  }

};

module.exports = client_cart_controller;