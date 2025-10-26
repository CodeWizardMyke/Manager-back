const {Category} = require('../database/models');

const { Op } = require('sequelize');
const paginateDefine = require('../functions/paginateDefine');

const category_controller =  {
    create: async (req,res) =>{
        try {
            const {category_name} = req.body;

            const categoryIsExistis = await Category.findAll({
                where:{category_name: category_name }
            })

            if(categoryIsExistis.length){
                return res.status(401).json({msg:'Essa categoria já existe!'})
            }

            if(!category_name){
                return res.status(401).json({error:'Nome da categoria deve ser preenchido!'})
            }

            const item = await Category.create(req.body);
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
            
            const response = await Category.findAndCountAll({
                where:{ category_name: {[Op.like]:`%${query}%`} },
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
            
            const searchItemForUpdate = await Category.findByPk(id);

            if(!searchItemForUpdate){
                return res.status(401).json({msg:"Nenhuma categoria encontrada com esse id!"})
            }

            const updated = await searchItemForUpdate.update(req.body);


            return res.json({ message: "Category updated successfully", updated: updated });
          } catch (error) {
            console.log(error);
            return res.status(500).json(error);
          }
          
    },
    delete: async (req,res) => {
        try {
            const {id} = req.headers;

            const deleted = await Category.destroy({where:{category_id:id}});

            if(deleted === 0){
                return res.status(404).json({error:'Categoria não encontrada!'})
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

            const response = await Category.findByPk(id);

            return res.json(response);
            
        } catch (error) {
            console.log('error', error);
            return res.status(500).json(error)
        }
    }
}

module.exports = category_controller;
