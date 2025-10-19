const {Brand} = require('../database/models');

const { Op } = require('sequelize');
const paginateDefine = require('../functions/paginateDefine');

const brand_crud_controller =  {
    create: async (req,res) =>{
        try {
            const {brand_name} = req.body;

            const brandExistis = await Brand.findAll({
                where:{brand_name: brand_name}
            })

            if(brandExistis.length){
                return res.status(401).json({msg:'Essa Marca já existe!'})
            }

            if(!brand_name){
                return res.status(401).json({error:'Nome da Marca deve ser preenchido!'})
            }

            const item =  await Brand.create(req.body);
            return res.status(201).json({"msg":"Criado com sucesso", data:item});

        } catch (error) {
            console.log('error', error);
            res.status(500).json(error);
        }
    },
    read: async (req,res) => {
        try {
            const {query} = req.headers;
            const {size,page} = paginateDefine(req);
            
            const response = await Brand.findAndCountAll({
                where:{ brand_name: {[Op.like]:`%${query}%`} },
                limit:size,
                offset:size * (page -1)
            });
            return res.status(200).json(response);

        } catch (error) {
            console.log('error', error);
            res.status(500).json(error);
        }
    },
    update: async (req,res) => {
        try {
            const { id } = req.headers;
            
            const searchItemForUpdate = await Brand.findByPk(id);

            if(!searchItemForUpdate){
                return res.status(401).json({msg:"Nenhuma Marca encontrada com esse id!"})
            }

            const updated = await searchItemForUpdate.update(req.body);


            return res.json({ message: "Marca updated successfully", updated: updated });
          } catch (error) {
            console.log(error);
            return res.status(500).json(error);
          }
    },
    delete: async (req,res) => {
        try {
            const {id} = req.headers;

            const deleted = await Brand.destroy({where:{Brand_id:id}});

            if(deleted === 0){
                return res.status(404).json({error:'Marca não encontrada!'})
            }
            return res.status(201).json({msg:'Registro deletado com sucesso!'});

        } catch (error) {
            console.log('error', error);
            return res.status(500).json(error);
        }
    },
    getById: async (req,res) => {
        try {
            const {id} = req.headers;

            const response = await Brand.findByPk(id);

            return res.json(response);
            
        } catch (error) {
            console.log('error', error);
            return res.status(500).json(error);
        }
    }
}

module.exports = brand_crud_controller;
