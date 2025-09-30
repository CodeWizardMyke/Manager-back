const { Op } = require('sequelize');
const {Client} = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');

const client_crud = {
    instagram: async (req, res ) => {
        try {
            const{instagram} = req.headers
            if(!instagram){
                return res.send({Error:{msg:"Is not passed a instagram!"}})
            }
            
            const {size, page} = paginateDefine(req)
            
            const data = await Client.findAndCountAll({
                where:{
                    clientInstagram:{[Op.like]:`${instagram}%`}
                },
                limit:size,
                offset: size * (page -1)
            });

            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.json(error)
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
            return res.json(error);
        }
    }
};

module.exports = client_crud;