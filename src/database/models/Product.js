
module.exports = (sequelize,DataTypes)=>{
  const Product = sequelize.define('Product',{
    product_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false,
      unique:true 
    },
    title:{
      type:DataTypes.STRING,
      allowNull:false 
    },
    official_store_name:DataTypes.STRING,
    category:DataTypes.STRING,
    discribe:DataTypes.TEXT,
    currency_type:DataTypes.STRING,
    price:{
      type:DataTypes.DECIMAL,
      allowNull:false 
    },
    originam_price:{
      type:DataTypes.DECIMAL,
      allowNull:false
    },
    sale_price:{
      type:DataTypes.DECIMAL,
      allowNull:false
    },
    stock:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    use_thumbnail:DataTypes.STRING,
    thumbnails:DataTypes.STRING,
    brand:{
      type:DataTypes.STRING,
      allowNull:false
    },
    gender:{
      type:DataTypes.STRING,
      allowNull:false 
    },
    GTIN:DataTypes.STRING,
    item_condittion:DataTypes.STRING,
    line:{
      type:DataTypes.STRING,
      allowNull:false
    },
    NET_VOLUM:DataTypes.STRING,
    NET_WEIGHT:DataTypes.STRING,
    winner_item_id:DataTypes.STRING,
    catalog_listing:DataTypes.STRING,
    discounts:DataTypes.STRING,
    promotions:DataTypes.DECIMAL,
  },
  {
    tableName:'product',
    timestamps:false,
  })

  return Product;
} 