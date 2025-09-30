const {Client} = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');

const client_crud = {
    create: async (req, res ) => {
        try {
            await Client.create(req.body);
            return res.status(201).json('criado com sucesso!')

        } catch (error) {
            console.log(error);
            return res.json(error)
        }
    },
    read: async (req, res ) => {
        try {
            const {size, page} = paginateDefine(req)
            
            const data = await Client.findAndCountAll({
                limit:size,
                offset: size * (page -1)
            });

            return res.status(200).json(data);

        } catch (error) {
            console.log(error);
            return res.json(error)
        }
    },
    update: async (req, res ) => {
        try {
            const {client_id}  = req.headers
            console.log('client_id', client_id)

            const data = await Client.findOne({where:{client_id:client_id}});
            delete req.body.client_id;

            await data.update(req.body);
            return res.send('Atualizado!')

        } catch (error) {
            console.log(error);
            return res.json(error)
        }
    },
    delete: async (req, res ) => {
        try {
            const {client_id} = req.headers;
            console.log(client_id)

            const data = await Client.findOne({where:{client_id:client_id}});
            await data.destroy() ;

            return res.status(201).json('Removido com sucesso!')
            
        } catch (error) {
            console.log(error);
            return res.json(error)
        }
    },
};

module.exports = client_crud;