const {Client} = require('../database/models');

const check_client_existis = async (req, res, next) => {
    const {clientInstagram,clientName} = req.body;
    let id;

    if(!clientInstagram){
        return res.status(401).json({Error:{msg:"Nenhum instagram foi passado!"}})
    }

    const clientData = await Client.findOne({
        where:{clientInstagram:clientInstagram}
    })

    if(!clientData){
        const newClient = await Client.create(
            {
                clientName:clientName,
                clientInstagram:clientInstagram
            }
        )

        id = newClient.client_id;
    }else{
        id = clientData.client_id;
    }

    req.body.client_id = id;

    return next();
};

module.exports = check_client_existis;
