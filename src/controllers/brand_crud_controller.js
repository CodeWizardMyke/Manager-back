const { Brand } = require('../database/models');

const { Op } = require('sequelize');

const paginateDefine = require('../functions/paginateDefine');

const {
    validateDemoLimit
} = require('../services/limits.service');

const {
    findVisibleEntity
} = require('../services/ownership.service');

const brand_crud_controller =  {

    create: async (req, res) => {

        try {

            const { brand_name } = req.body;

            const { employee_id } = req.token_decoded;

            if(!brand_name){

                return res.status(400).json({
                    error:'Nome da Marca deve ser preenchido!'
                });

            }

            /*
                Limite demo
            */
            const limitReached = await validateDemoLimit({
                model: Brand,
                employee_id
            });

            if(limitReached){

                return res.status(403).json({
                    errors:[{
                        path:'demo',
                        msg:'Limite de marcas atingido na versão demo.'
                    }]
                });

            }

            /*
                Verifica duplicidade
                (global + usuário)
            */
            const exists = await Brand.findOne({

                where:{
                    brand_name,

                    [Op.or]: [
                        { owner_employee_id: null },
                        { owner_employee_id: employee_id }
                    ]
                }

            });

            if(exists){

                return res.status(409).json({
                    msg:'Essa Marca já existe!'
                });

            }

            /*
                Define owner
            */
            const payload = {
                ...req.body,
                owner_employee_id:
                    employee_id === 1 ? null : employee_id
            };

            const item = await Brand.create(payload);

            return res.status(201).json({
                msg:'Criado com sucesso',
                data:item
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    read: async (req, res) => {

        try {

            const { employee_id } = req.token_decoded;

            const { query = '' } = req.headers;

            const { size, page } = paginateDefine(req);

            const response = await Brand.findAndCountAll({

                where:{

                    brand_name:{
                        [Op.like]: `%${query}%`
                    },

                    [Op.or]: [
                        { owner_employee_id: null },
                        { owner_employee_id: employee_id }
                    ]

                },

                limit: size,

                offset: size * (page - 1),

                distinct: true

            });

            return res.status(200).json(response);

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    update: async (req, res) => {

        try {

            const { id } = req.headers;

            const { employee_id } = req.token_decoded;

            if(!id){

                return res.status(400).json({
                    error:'id não informado'
                });

            }

            const brand = await findVisibleEntity({
                model: Brand,
                employee_id,
                idField:'brand_id',
                idValue:id
            });

            if(!brand){

                return res.status(404).json({
                    msg:'Marca não encontrada!'
                });

            }

            /*
                Não pode editar global
            */
            if(brand.owner_employee_id === null){

                return res.status(403).json({
                    errors:[{
                        path:'brand',
                        msg:'Marcas padrão não podem ser editadas.'
                    }]
                });

            }

            /*
                Segurança
            */
            if(brand.owner_employee_id !== employee_id){

                return res.status(403).json({
                    errors:[{
                        path:'auth',
                        msg:'Você não tem permissão para editar essa marca.'
                    }]
                });

            }

            const updated = await brand.update(req.body);

            return res.json({
                message:'Marca atualizada com sucesso',
                updated
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    delete: async (req, res) => {

        try {

            const { id } = req.headers;

            const { employee_id } = req.token_decoded;

            if(!id){

                return res.status(400).json({
                    error:'id não informado'
                });

            }

            const brand = await Brand.findByPk(id);

            if(!brand){

                return res.status(404).json({
                    error:'Marca não encontrada!'
                });

            }

            /*
                Não pode deletar global
            */
            if(brand.owner_employee_id === null){

                return res.status(403).json({
                    errors:[{
                        path:'brand',
                        msg:'Marcas padrão não podem ser deletadas.'
                    }]
                });

            }

            /*
                Só pode deletar o próprio
            */
            if(brand.owner_employee_id !== employee_id){

                return res.status(403).json({
                    errors:[{
                        path:'auth',
                        msg:'Você não tem permissão para deletar essa marca.'
                    }]
                });

            }

            await brand.destroy();

            return res.status(200).json({
                msg:'Marca deletada com sucesso!'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    getById: async (req, res) => {

        try {

            const { id } = req.headers;

            const { employee_id } = req.token_decoded;

            if(!id){

                return res.status(400).json({
                    error:'id não informado'
                });

            }

            const response = await Brand.findOne({

                where:{
                    brand_id: id,

                    [Op.or]: [
                        { owner_employee_id: null },
                        { owner_employee_id: employee_id }
                    ]
                }

            });

            if(!response){

                return res.status(404).json({
                    error:'Marca não encontrada!'
                });

            }

            return res.json(response);

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    }

};

module.exports = brand_crud_controller;