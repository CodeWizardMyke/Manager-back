const { Op } = require('sequelize');

const { Client } = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');

const client_crud = {

    instagram: async (req, res) => {

        try {

            const { employee_id } = req.token_decoded;

            const { clientinstagram } = req.headers;

            if(!clientinstagram){

                return res.status(400).json({
                    error:{
                        msg:'instagram do cliente não foi informado!'
                    }
                });

            }

            const { size, page } = paginateDefine(req);

            const data = await Client.findAndCountAll({

                where:{

                    clientInstagram:{
                        [Op.like]: `%${clientinstagram}%`
                    },

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

    get_all: async (req, res) => {

        try {

            const { employee_id } = req.token_decoded;

            const { size, page } = paginateDefine(req);

            const data = await Client.findAndCountAll({

                where:{
                    owner_employee_id: employee_id
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

module.exports = client_crud;