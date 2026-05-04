const { Category } = require('../database/models');

const { Op } = require('sequelize');

const paginateDefine = require('../functions/paginateDefine');

const {
    validateDemoLimit
} = require('../services/limits.service');

const {
    findVisibleEntity
} = require('../services/ownership.service');

const category_controller = {

    create: async (req, res) => {

        try {

            const { category_name } = req.body;

            const { employee_id } = req.token_decoded;

            if(!category_name){

                return res.status(400).json({
                    error:'Nome da categoria deve ser preenchido!'
                });

            }

            /*
                Limite demo
            */
            const limitReached = await validateDemoLimit({
                model: Category,
                employee_id
            });

            if(limitReached){

                return res.status(403).json({
                    errors:[{
                        path:'demo',
                        msg:'Limite de categorias atingido na versão demo.'
                    }]
                });

            }

            /*
                Verifica duplicidade
            */
            const exists = await Category.findOne({
                where:{ category_name }
            });

            if(exists){

                return res.status(409).json({
                    msg:'Essa categoria já existe!'
                });

            }

            /*
                Define owner (se não for admin/demo global)
            */
            const payload = {
                ...req.body,
                owner_employee_id:
                    employee_id === 1 ? null : employee_id
            };

            const item = await Category.create(payload);

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

        const response = await Category.findAndCountAll({

            where:{

                category_name:{
                    [Op.like]: `%${query}%`
                },

                [Op.or]: [
                    { owner_employee_id: null },        // globais
                    { owner_employee_id: employee_id }  // do usuário
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

            /*
                Busca categoria visível
            */
            const category = await findVisibleEntity({
                model: Category,
                employee_id,
                idField:'category_id',
                idValue:id
            });

            if(!category){

                return res.status(404).json({
                    msg:'Categoria não encontrada!'
                });

            }

            /*
                Bloqueia edição de categoria global
            */
            if(category.owner_employee_id === null){

                return res.status(403).json({
                    errors:[{
                        path:'category',
                        msg:'Categorias padrão não podem ser editadas.'
                    }]
                });

            }

            /*
                Segurança extra (não editar de outro usuário)
            */
            if(category.owner_employee_id !== employee_id){

                return res.status(403).json({
                    errors:[{
                        path:'auth',
                        msg:'Você não tem permissão para editar essa categoria.'
                    }]
                });

            }

            const updated = await category.update(req.body);

            return res.json({
                message:'Categoria atualizada com sucesso',
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

            const category = await Category.findByPk(id);

            if(!category){

                return res.status(404).json({
                    error:'Categoria não encontrada!'
                });

            }

            /*
                Bloqueia exclusão de categoria global
            */
            if(category.owner_employee_id === null){

                return res.status(403).json({
                    errors:[{
                        path:'category',
                        msg:'Categorias padrão não podem ser deletadas.'
                    }]
                });

            }

            /*
                Só pode deletar o que é seu
            */
            if(category.owner_employee_id !== employee_id){

                return res.status(403).json({
                    errors:[{
                        path:'auth',
                        msg:'Você não tem permissão para deletar essa categoria.'
                    }]
                });

            }

            await category.destroy();

            return res.status(200).json({
                msg:'Categoria deletada com sucesso!'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    getById: async (req, res) => {

        try {

            const { id } = req.headers;

            if(!id){

                return res.status(400).json({
                    error:'id não informado'
                });

            }

            /*
                Todos podem visualizar
            */
            const response = await Category.findByPk(id);

            if(!response){

                return res.status(404).json({
                    error:'Categoria não encontrada!'
                });

            }

            return res.json(response);

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    }

};

module.exports = category_controller;