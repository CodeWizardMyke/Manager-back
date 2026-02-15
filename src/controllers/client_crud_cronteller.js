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
            const {clientInstagram} = req.body;
            if(!client_id){
                return res.status(400).json({errors:{errors:[{path:'client_id',msg:"client id não foi recebido!"}]}})
            }

            const data = await Client.findOne({where:{client_id:client_id}});
            
            async function checkExistsInstagram(instagram){
                const consultResult = await Client.findOne({where:{clientInstagram:clientInstagram}})
                if(consultResult){
                    return res.status(400).json({errors:{errors:[{path:'clientInstagram',msg:"Este instagram já é cadastrado a outro cliente!"}]}})
                }
            }

            if(clientInstagram && clientInstagram !== data.clientInstagram){
                checkExistsInstagram(clientInstagram);
            }

            const updatedData = await data.update(req.body);
            return res.json(updatedData);

        } catch (error) {
            console.log(error);
            return res.json(error)
        }
    },
    delete: async (req, res ) => {
        try {
            const {client_id} = req.headers;
            if(!client_id){
                return res.status(400).json({errors:{errors:[{path:'client_id',msg:"client id não foi recebido!"}]}})
            }

            const data = await Client.findOne({where:{client_id:client_id}});
            await data.destroy() ;

            return res.status(201).json('Removido com sucesso!')
            
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    },
};

module.exports = client_crud;