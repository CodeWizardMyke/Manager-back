  const {Product,Category, Brand, Employee, sequelize} = require ('../database/models');

const dashboard_controller ={

    read: async (req,res) => {
        try {

            const { employee_id } = req.token_decoded;

            const {role} = await Employee.findOne({where:employee_id});

            const where = role === "admin" ? {} : {owner_employee_id:employee_id}

            const [
                totalProducts,
                totalBrands,
                totalCategories,
                recentProducts,
            ] = await Promise.all([

                Product.count({where}),
                Brand.count({where}),
                Category.count({where}),
                Product.findAll({
                    limit:5,
                    order:
                        [
                            ['createdAt', 'DESC']
                        ]
                })
            ])

            const distribution = await Product.findAll({
                where,
                attributes:[
                    'fk_category_id',
                    [
                        sequelize.fn("COUNT", sequelize.col("Product.product_id")),
                        "value"
                    ]

                ],
                
                include: [
                    {
                        model: Category,
                        attributes: ["category_name"],
                        as:"categoryProduct"
                    }
                ],

                group: [
                    "fk_category_id",
                    "category_id"
                ]
            });

            const dataDistribution = distribution.map(item => ({

                label: item.categoryProduct.category_name,
                value: Number(item.get("value"))

            }));

            const data = {
                totalProducts,
                totalBrands,
                totalCategories,
                recentProducts,
                distributed:dataDistribution
            }

            res.status(201).json(data);
            
        } catch(error) {
            
            console.log(error);

            return res.status(500).json(error);
        }
    }

}


module.exports = dashboard_controller;