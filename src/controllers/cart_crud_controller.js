const { Cart, Cart_item, Product, Client } = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');

const Cart_crud_controller = {

  create: async (req, res) => {

    try {

      const { employee_id } = req.token_decoded;

      const { client_id, items } = req.body;

      if(!client_id || !items){

        return res.status(400).json({
          error:{ msg:'client_id ou items não informados!' }
        });

      }

      /*
        valida se o cliente pertence ao usuário
      */
      const client = await Client.findOne({
        where:{
          client_id,
          owner_employee_id: employee_id
        }
      });

      if(!client){

        return res.status(403).json({
          error:'Cliente não pertence a este usuário.'
        });

      }

      /*
        cria estrutura do carrinho
      */
      const objectCart = {
        amount: 0,
        qtd_products: 0,
        state: 'pendding',
        fk_client_id: client_id
      };

      for(const item of items){

        const product = await Product.findByPk(item.product_id);

        if(!product){
          return res.status(404).json({
            error:`Produto ${item.product_id} não encontrado`
          });
        }

        objectCart.qtd_products += item.qtd_products;
        objectCart.amount += Number(product.selling_price) * item.qtd_products;

      }

      const cartCreated = await Cart.create(objectCart);

      for(const item of items){

        await Cart_item.create({
          fk_cart_id: cartCreated.cart_id,
          fk_product_id: item.product_id,
          qtd_products: item.qtd_products
        });

      }

      return res.status(201).json(cartCreated);

    } catch (error) {

      console.log(error);

      return res.status(500).json(error);

    }

  },

  read: async (req, res) => {

    try {

      const { employee_id } = req.token_decoded;

      const { page, size } = paginateDefine(req);

      let { client_id, state } = req.headers;

      /*
        valida ownership do cliente
      */
      const client = await Client.findOne({
        where:{
          client_id,
          owner_employee_id: employee_id
        }
      });

      if(!client){

        return res.status(403).json({
          error:'Cliente não pertence a este usuário.'
        });

      }

      const data = await Cart.findAndCountAll({

        where:{
          fk_client_id: client_id,
          state: state || 'pendding'
        },

        limit: size,

        offset: size * (page - 1),

        distinct: true

      });

      return res.json(data);

    } catch (error) {

      console.log(error);

      return res.status(500).json(error);

    }

  },

  update: async (req, res) => {

    try {

      const { employee_id } = req.token_decoded;

      const { cart_id } = req.headers;

      const cart = await Cart.findOne({
        where:{ cart_id },
        include:[
          {
            model: Client,
            required: true,
            where:{ owner_employee_id: employee_id }
          }
        ]
      });

      if(!cart){

        return res.status(403).json({
          error:'Carrinho não pertence a este usuário.'
        });

      }

      if(cart.state === 'approved'){

        return res.status(403).json({
          error:'Carrinho já aprovado!'
        });

      }

      await cart.update(req.body);

      return res.json(cart);

    } catch (error) {

      console.log(error);

      return res.status(500).json(error);

    }

  },

  delete: async (req, res) => {

    try {

      const { employee_id } = req.token_decoded;

      const { cart_id } = req.headers;

      const cart = await Cart.findOne({
        where:{
          cart_id,
          state:'pendding'
        },
        include:[
          {
            model: Client,
            required: true,
            where:{ owner_employee_id: employee_id }
          }
        ]
      });

      if(!cart){

        return res.status(403).json({
          error:'Carrinho inexistente, já aprovado ou não pertence ao usuário.'
        });

      }

      const items = await Cart_item.findAll({
        where:{ fk_cart_id: cart_id }
      });

      for(const item of items){
        await item.destroy();
      }

      await cart.destroy();

      return res.json({
        successful:{ msg:'Carrinho deletado com sucesso!' }
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json(error);

    }

  }

};

module.exports = Cart_crud_controller;