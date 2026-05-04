
module.exports = (Sequelize, DateTypes) =>{
    const Brand = Sequelize.define('Brand',{
        brand_id:{
            type:DateTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        brand_name:DateTypes.STRING,
        owner_employee_id: {
            type: DateTypes.INTEGER,
            allowNull: true
        },
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
        Brand.belongsTo(models.Employee, {
            foreignKey: 'owner_employee_id',
            as: 'owner'
        });
    };
    return Brand;
}