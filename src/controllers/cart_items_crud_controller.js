const { Cart_item, Cart, Client, Product } = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');

const { validateCartOwnership } = require('../services/ownership.service.js');

const cart_items_crud_controller = {

  create: async (req, res) => {

    try {

      const { employee_id } = req.token_decoded;

      const { cart_id, items } = req.body;

      if(!cart_id || !items){

        return res.status(400).json({
          error:{ msg:'cart_id ou items não informados!' }
        });

      }

      /*
        valida se o carrinho pertence ao usuário
      */
      const cart = await validateCartOwnership({
        cart_id,
        employee_id,
        Cart,
        Client
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

      for(const item of items){

        await Cart_item.create({
          fk_cart_id: cart_id,
          fk_product_id: item.product_id,
          qtd_products: item.qtd_products
        });

      }

      return res.status(201).json({
        successful:{ msg:'Items adicionados com sucesso!' }
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json(error);

    }

  },

  read: async (req, res) => {

    try {

      const { employee_id } = req.token_decoded;

      const { cart_id } = req.headers;

      const { page, size } = paginateDefine(req);

      if(!cart_id){

        return res.status(400).json({
          error:{ msg:'cart_id não informado!' }
        });

      }

      const cart = await validateCartOwnership({
        cart_id,
        employee_id,
        Cart,
        Client
      });

      if(!cart){

        return res.status(403).json({
          error:'Carrinho não pertence a este usuário.'
        });

      }

      const data = await Cart_item.findAndCountAll({

        where:{ fk_cart_id: cart_id },

        limit: size,

        offset: size * (page - 1),

        include:[
          {
            model: Product,
            as:'product'
          }
        ],

        distinct:true

      });

      return res.status(200).json(data);

    } catch (error) {

      console.log(error);

      return res.status(500).json(error);

    }

  },

  update: async (req, res) => {

    try {

      const { employee_id } = req.token_decoded;

      const { cart_item_id } = req.headers;

      if(!cart_item_id){

        return res.status(400).json({
          error:{ msg:'cart_item_id não informado!' }
        });

      }

      const item = await Cart_item.findByPk(cart_item_id);

      if(!item){

        return res.status(404).json({
          error:'Item não encontrado!'
        });

      }

      const cart = await validateCartOwnership({
        cart_id: item.fk_cart_id,
        employee_id,
        Cart,
        Client
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

      await item.update(req.body);

      return res.status(200).json({
        successful:{ msg:'Item atualizado com sucesso!' }
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json(error);

    }

  },

  delete: async (req, res) => {

    try {

      const { employee_id } = req.token_decoded;

      const { cart_item_id } = req.headers;

      if(!cart_item_id){

        return res.status(400).json({
          error:{ msg:'cart_item_id não informado!' }
        });

      }

      const item = await Cart_item.findByPk(cart_item_id);

      if(!item){

        return res.status(404).json({
          error:'Item não encontrado!'
        });

      }

      const cart = await validateCartOwnership({
        cart_id: item.fk_cart_id,
        employee_id,
        Cart,
        Client
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

      await item.destroy();

      return res.status(200).json({
        successful:{ msg:'Item deletado com sucesso!' }
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json(error);

    }

  }

};

module.exports = cart_items_crud_controller;