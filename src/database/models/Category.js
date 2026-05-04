
module.exports = (Sequelize, DateTypes) =>{
    const Category = Sequelize.define('Category',{
        category_id:{
            type:DateTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        category_name:DateTypes.STRING,
        owner_employee_id: {
            type: DateTypes.INTEGER,
            allowNull: true
        },
    },
    {
        tableName:'category',
        timestamps:false
    });

    Category.associate = (models) => {
        // Uma categoria possui muitos produtos
        Category.hasMany(models.Product, { 
            foreignKey: 'fk_category_id', 
            as: 'categoryProduct' 
        });
        Category.belongsTo(models.Employee, {
            foreignKey: 'owner_employee_id',
            as: 'owner'
        });
    };

    return Category;
}