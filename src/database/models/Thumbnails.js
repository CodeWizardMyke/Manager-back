
module.exports = (sequelize, DataTypes) => {
    const Thumbnails = sequelize.define("Thumbnails", {
        thumbnail_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
          },
          path:DataTypes.TEXT,
          type:DataTypes.INTEGER,
          fk_product_id:DataTypes.INTEGER
    },
    {
        tableName:'thumbnails',
        timestamps:false
    })

    Thumbnails.associate = (models) => {
        Thumbnails.belongsTo(models.Product, { 
            foreignKey: "fk_product_id",as:'productThumbnails'
        });
    }

    return Thumbnails;
}