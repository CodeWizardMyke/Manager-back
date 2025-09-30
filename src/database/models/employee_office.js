
module.exports = (Sequelize, DateTypes) => {

    const Employee_office = Sequelize.define('Employee_office',{
        role_id:{
            type:DateTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        role:DateTypes.STRING
    },{
        tableName:'employee_office',
        timestamps:false
    });

    return Employee_office;
}