const { Client } = require('../database/models');

const { Op } = require('sequelize');

const paginateDefine = require('../functions/paginateDefine');

const {
    validateDemoLimit
} = require('../services/limits.service');

const client_crud = {

    create: async (req, res) => {

        try {

            const { employee_id } = req.token_decoded;

            /*
                Limite demo
            */
            const limitReached = await validateDemoLimit({
                model: Client,
                employee_id
            });

            if(limitReached){

                return res.status(403).json({
                    errors:[{
                        path:'demo',
                        msg:'Limite de clientes atingido na versão demo.'
                    }]
                });

            }

            /*
                Verifica duplicidade de instagram (somente do usuário)
            */
            if(req.body.clientInstagram){

                const exists = await Client.findOne({
                    where:{
                        clientInstagram: req.body.clientInstagram,
                        owner_employee_id: employee_id
                    }
                });

                if(exists){

                    return res.status(409).json({
                        errors:[{
                            path:'clientInstagram',
                            msg:'Este instagram já está cadastrado!'
                        }]
                    });

                }

            }

            const payload = {
                ...req.body,
                owner_employee_id: employee_id
            };

            const data = await Client.create(payload);

            return res.status(201).json({
                msg:'Criado com sucesso!',
                data
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    read: async (req, res) => {

        try {

            const { employee_id } = req.token_decoded;

            const { size, page } = paginateDefine(req);

            /*
                Só retorna clientes do usuário
            */
            const data = await Client.findAndCountAll({

                where:{
                    owner_employee_id: employee_id
                },

                limit: size,

                offset: size * (page - 1),

                distinct: true

            });

            return res.status(200).json(data);

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    update: async (req, res) => {

        try {

            const { client_id } = req.headers;

            const { employee_id } = req.token_decoded;

            const { clientInstagram } = req.body;

            if(!client_id){

                return res.status(400).json({
                    errors:[{
                        path:'client_id',
                        msg:'client_id não foi recebido!'
                    }]
                });

            }

            /*
                Busca cliente do usuário
            */
            const client = await Client.findOne({

                where:{
                    client_id,
                    owner_employee_id: employee_id
                }

            });

            if(!client){

                return res.status(404).json({
                    error:'Cliente não encontrado!'
                });

            }

            /*
                Verifica duplicidade de instagram
            */
            if(clientInstagram && clientInstagram !== client.clientInstagram){

                const exists = await Client.findOne({
                    where:{
                        clientInstagram,
                        owner_employee_id: employee_id
                    }
                });

                if(exists){

                    return res.status(409).json({
                        errors:[{
                            path:'clientInstagram',
                            msg:'Este instagram já está cadastrado!'
                        }]
                    });

                }

            }

            const updatedData = await client.update(req.body);

            return res.json(updatedData);

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    delete: async (req, res) => {

        try {

            const { client_id } = req.headers;

            const { employee_id } = req.token_decoded;

            if(!client_id){

                return res.status(400).json({
                    errors:[{
                        path:'client_id',
                        msg:'client_id não foi recebido!'
                    }]
                });

            }

            /*
                Só deleta o que é do usuário
            */
            const client = await Client.findOne({

                where:{
                    client_id,
                    owner_employee_id: employee_id
                }

            });

            if(!client){

                return res.status(404).json({
                    error:'Cliente não encontrado!'
                });

            }

            await client.destroy();

            return res.status(200).json({
                msg:'Removido com sucesso!'
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    }

};

module.exports = client_crud;