
module.exports = (Sequelize, DateTypes) =>{
    const Category = Sequelize.define('Category',{
        category_id:{
            type:DateTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        category_name:DateTypes.STRING,
    },
    {
        tableName:'category',
        timestamps:false
    });

    Category.associate = (models) => {
        // Uma categoria possui muitos produtos
        Category.hasMany(models.Product, { 
            foreignKey: 'fk_category_id', 
            as: 'products' 
        });
    };

    return Category;
}