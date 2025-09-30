
module.exports =  (sequelize, Datetypes) => {
  const Payment = sequelize.define('Payment',{
    payment_id:{
      type:Datetypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false,
      unique:true
    },
    fk_client_id:{
      type:Datetypes.STRING,
      allowNull:false,
    },
    fk_cart_id:{
      type: Datetypes.INTEGER,
      allowNull:false,
    },
    payment_method:{
      type:Datetypes.STRING,
      allowNull:false,
    },
    payment_status:{
      type:Datetypes.INTEGER,
      allowNull:false,
    },  
    createdAt:Datetypes.DATE,
    updatedAt:Datetypes.DATE,
  },
  {
    tableName:'payment',
    timestamps:true,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Cart, {
      foreignKey: 'fk_cart_id',
      as: 'cart',
    });

    Payment.belongsTo(models.Client,{
      foreignKey:'fk_client_id',
      as:'client'
    })
  }

  return Payment;  
};
