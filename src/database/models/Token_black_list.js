
module.exports = (sequelize, DataTypes) => {
  const Token_black_list = sequelize.define('Token_black_list',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false,
      unique:true,
      autoIncrement:true,
    },
    token:{
      type:DataTypes.TEXT,
      allowNull:false,
      unique:true,
    },
    updatedAt:DataTypes.DATE,
    createdAt:DataTypes.DATE,
  },
  {
    tableName:'token_black_list',
    timestamps:true,
  })

  return Token_black_list;
}