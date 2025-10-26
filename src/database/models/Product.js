
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
    discribe:DataTypes.TEXT,
    currency:DataTypes.STRING,
    product_cost:{
      type:DataTypes.DECIMAL,
      allowNull:false 
    },
    selling_price:{
      type:DataTypes.DECIMAL,
      allowNull:false
    },
    profit_margin:{
      type:DataTypes.DECIMAL,
      allowNull:false
    },
    discounts:DataTypes.INTEGER,
    stock:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    use_thumbnail:DataTypes.STRING,
    product_state:DataTypes.STRING,
    movie_url:DataTypes.STRING,
    GTIN:DataTypes.STRING,
    NET_VOLUM:{
      type:DataTypes.STRING,
      allowNull:false
    },
    NET_WEIGHT:DataTypes.STRING,
    winner_item_id:DataTypes.STRING,
    catalog_listing:DataTypes.STRING,
    additional:DataTypes.STRING,
    product_shape:DataTypes.STRING,
    isNewArrival:DataTypes.STRING,
    targetGender:DataTypes.STRING,
    age_group:DataTypes.STRING,
    fk_category_id:DataTypes.INTEGER,
    fk_brand_id:DataTypes.INTEGER,
  },
  {
    tableName:'product',
    timestamps:true,
  })

  Product.associate = (models) => {
    Product.belongsTo(models.Brand, {
      foreignKey: 'fk_brand_id',
      as:"brandProduct"
    });
    Product.belongsTo(models.Category, {
      foreignKey: 'fk_category_id',
      as:"categoryProduct"
    });
    Product.hasMany(models.Thumbnails, {
      foreignKey: "fk_product_id",
      as: "thumbnails",
    });
  };
  
  return Product;
} 