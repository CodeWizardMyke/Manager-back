
module.exports = (Sequelize, DateTypes) =>{
    const Brand = Sequelize.define('Brand',{
        brand_id:{
            type:DateTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        brand_name:DateTypes.STRING,
    },
    {
        tableName:'brand',
        timestamps:false
    });

    Brand.associate = (models) => {
        // Uma categoria possui muitos produtos
        Brand.hasMany(models.Product, { 
            foreignKey: 'fk_brand_id', 
            as: 'brandProduct' 
        });
    };
    return Brand;
}