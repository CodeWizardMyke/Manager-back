module.exports = (sequelize, DataTypes) => {

   const HiddenProduct = sequelize.define(
      'HiddenProduct',
      {

         hidden_product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
         },

         fk_employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
         },

         fk_product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
         },

         expires_at: {
            type: DataTypes.DATE,
            allowNull: true
         }

      },
      {
         tableName: 'hidden_product',
         freezeTableName: true
      }
   );

   HiddenProduct.associate = (models) => {

      HiddenProduct.belongsTo(models.Employee, {
         foreignKey: 'fk_employee_id',
         as: 'employee'
      });

      HiddenProduct.belongsTo(models.Product, {
         foreignKey: 'fk_product_id',
         as: 'product'
      });

   };

   return HiddenProduct;

};