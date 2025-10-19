const {Cart_item, Cart} = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');

const cart_items_crud_controller = {
  create: async (req,res) => {
    try {
      const {cart_id,items} = req.body;

      if(!cart_id || !items){
        return res.status(401).json({Error:{msg:"Nenuhm id carrinho ou produtos foi recebido revise os dados!"}})
      }

      for(const item of items){
        await Cart_item.create(
          {
            fk_cart_id: cart_id,
            fk_product_id: item.product_id,
            qtd_products: item.qtd_products
          }
        )
      }

      return res.status(201).json({successful:{msg:'items adicionado com sucesso no carrinho!'}})
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  },
  read: async (req, res) => {
    try {
      const {cart_id} = req.headers;
      const { page, size } = paginateDefine(req);

      if(!cart_id){
        return res.status(401).json({Error:{msg:"Não foi passado o id do carrinho referente!"}})
      }

      const data = await Cart_item.findAndCountAll({
        where:{fk_cart_id:cart_id},
        limit: size,
        offset: size * ( page -1 ),
        include: 'product'
      })

      return res.status(200).json(data)
      
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)
    }
  },
  update: async (req,res) => {
    try {
      const {cart_item_id} = req.headers;

      if(!cart_item_id){
        return res.status(401).json({Error:{msg:"Nenhum id do item cart foi passado!"}});
      }

      const data = await Cart_item.findByPk(cart_item_id)

      const cartSearch = await Cart.findByPk(data.fk_cart_id);

      if(!cartSearch || cartSearch.state === 'approved'){
        return res.status(401).json({Error:{msg:"Impossível apagar o item, carrinho já aprovado ou carrinho inexistente!"}});
      }

      await data.update(req.body);
      return res.status(201).json({successful:{msg:'Item atualizado com sucesso!'}})
      
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)
    }
  },
  delete: async (req,res) =>{
    try {
      const {cart_item_id} = req.headers;

      if(!cart_item_id){
        return res.status(401).json({Error:{msg:"Nenhum id do carrinho foi recebido"}});
      }

      const data = await Cart_item.findByPk(cart_item_id);

      const cartSearch = await Cart.findByPk(data.fk_cart_id);

      if(!cartSearch || cartSearch.state === 'approved'){
        return res.status(401).json({Error:{msg:"Impossível apagar o item, carrinho já aprovado ou carrinho inexistente!"}});
      }

      await data.destroy();

      return res.status(200).json({successful:{msg:"Item do carrinho deletado com sucesso!"}})
      
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)
    }
  }

};

module.exports = cart_items_crud_controller;