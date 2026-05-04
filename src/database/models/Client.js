
module.exports = (Sequelize, DateTypes) =>{
    const Client = Sequelize.define('Client',{
        client_id:{
            type:DateTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        clientName:DateTypes.STRING,
        clientInstagram:DateTypes.STRING, 
        owner_employee_id: {
            type: DateTypes.INTEGER,
            allowNull: true
        },
    },
    {
        tableName:'client',
        timestamps:false
    });

    Client.associate = (models) => {
          Client.belongsTo(models.Employee, {
            foreignKey: 'owner_employee_id',
            as: 'owner'
        });
    }

    return Client;
}
