const {Client} = require('../database/models');

const check_client_existis = async (req, res, next) => {
    const { client_id} = req.body;

    const checkedClient = await Client.findByPk(Number(client_id));

    if(!checkedClient){
        return res.status(400).json({error:{path:'client_id',msg:"Id cliente inválido!"}})
    }

    return next();
};

module.exports = check_client_existis;
