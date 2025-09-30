
module.exports =  (sequelize, Datetypes) => {
  const Cart = sequelize.define('Cart',{
    cart_id:{
      type:Datetypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false,
      unique:true
    },
    qtd_products:{
      type:Datetypes.INTEGER,
      allowNull:false
    },
    amount:{
      type: Datetypes.DECIMAL,
      allowNull:false
    },
    state:Datetypes.STRING,
    fk_client_id:Datetypes.INTEGER,
    createdAt:Datetypes.DATE,
    updatedAt:Datetypes.DATE,
  },{
    tableName:'cart',
    timestamps:true,
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Client, {
      foreignKey: 'fk_client_id',
      as: 'client'
    });
  }

  return Cart;  
};
