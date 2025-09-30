
module.exports =  (sequelize, Datetypes) => {
  const Employee = sequelize.define('Employee',{
    employee_id:{
      type:Datetypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false,
      unique:true
    },
    name:{
      type:Datetypes.STRING,
      allowNull:false
    },
    role:Datetypes.STRING,
    email:{
      type:Datetypes.STRING,
      allowNull:false,
      unique:true
    },
    password:{
      type:Datetypes.STRING,
      allowNull:false
    },
    createdAt:Datetypes.DATE,
    updatedAt:Datetypes.DATE,
  },{
    tableName:'employee',
    timestamps:true,
  });
  return Employee;  
};
