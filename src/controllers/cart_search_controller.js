const { Cart, Client } = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');

const cart_search_controller = {

  get_cart_client: async (req, res) => {

    try {

      const { page, size } = paginateDefine(req);

      const { employee_id } = req.token_decoded;


      let { client_id, state } = req.headers;

      if(!client_id ){

        return res.status(400).json({
          error:{ msg:'Nenhum id de cliente foi passado!' }
        });

      }

      /*
        Valida ownership do cliente
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

  get_all_cart: async (req, res) => {

    try {

      const { page, size } = paginateDefine(req);

      const { employee_id } = req.token_decoded;

      let { state } = req.headers;

      /*
        Busca TODOS os clients do usuário
      */
      const clients = await Client.findAll({

        where:{
          owner_employee_id: employee_id
        },

        attributes:['client_id']

      });

      const clientIds = clients.map(c => c.client_id);

      /*
        Se não tiver clientes, evita query desnecessária
      */
      if(!clientIds.length){

        return res.json({
          count: 0,
          rows: []
        });

      }

      const data = await Cart.findAndCountAll({

        where:{
          fk_client_id: clientIds,
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

  }

};

module.exports = cart_search_controller;