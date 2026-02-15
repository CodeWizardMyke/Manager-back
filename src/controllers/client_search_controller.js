const { Op } = require('sequelize');
const {Client} = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');

const client_crud = {
    instagram: async (req, res ) => {
        try {
            const{clientinstagram} = req.headers
            if(!clientinstagram){
                return res.send({error:{msg:"instagram do cliente não foi informado!"}})
            }
            
            const {size, page} = paginateDefine(req)
            
            const data = await Client.findAndCountAll({
                where:{
                    clientInstagram:{[Op.like]:`%${clientinstagram}%`}
                },
                limit:size,
                offset: size * (page -1)
            });

            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    },
    get_all: async (req,res) => {
        try {
            const { size, page } = paginateDefine(req);

            const data = await Client.findAndCountAll({
                limit:size,
                offset: size * (page -1 ),
            });

            return res.json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
};

module.exports = client_crud;