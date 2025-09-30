
module.exports = (Sequelize, DateTypes) =>{
    const Client = Sequelize.define('Client',{
        client_id:{
            type:DateTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        clientName:DateTypes.STRING,
        clientInstagram:DateTypes.STRING
    },
    {
        tableName:'client',
        timestamps:false
    });

    return Client;
}