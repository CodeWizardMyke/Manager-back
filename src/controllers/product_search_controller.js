const {
    Product,
    Brand,
    Thumbnails,
    Category,
    HiddenProduct
} = require('../database/models');

const { Op } = require('sequelize');

const paginateDefine = require('../functions/paginateDefine');

const buildWhereVisibility = async (employee_id) => {

    /*
        Busca produtos ocultados pelo usuário
    */
    const hiddenProducts = await HiddenProduct.findAll({
        where:{
            fk_employee_id: employee_id
        },
        attributes:['fk_product_id']
    });

    const hiddenIds = hiddenProducts.map(
        item => item.fk_product_id
    );

    /*
        Produtos visíveis:
        - globais
        - do usuário
    */
    const whereVisibility = {
        [Op.or]: [
            { owner_employee_id: null },
            { owner_employee_id: employee_id }
        ]
    };

    /*
        Exclui ocultados
    */
    if(hiddenIds.length > 0){

        whereVisibility.product_id = {
            [Op.notIn]: hiddenIds
        };

    }

    return whereVisibility;

};

const product_search_controller = {

    getByTitle: async (req, res) => {

        try {

            const { employee_id } = req.token_decoded;

            const { size, page } = paginateDefine(req);

            const { query } = req.headers;

            if(!query){
                return res.status(400).json({
                    error:{
                        path:'title',
                        msg:'Nenhum título foi recebido!'
                    }
                });
            }

            const title = query.toString().trim();

            const whereVisibility = await buildWhereVisibility(
                employee_id
            );

            const data = await Product.findAndCountAll({

                where:{
                    ...whereVisibility,

                    title:{
                        [Op.like]: `%${title}%`
                    }
                },

                limit: size,

                offset: size * (page - 1),

                distinct: true,

                include:[
                    {
                        model: Brand,
                        as:'brandProduct'
                    },
                    {
                        model: Category,
                        as:'categoryProduct'
                    },
                    {
                        model: Thumbnails,
                        as:'thumbnails',
                        required:false
                    },
                ],

            });

            return res.json(data);

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    getById: async (req, res) => {

        try {

            const { employee_id } = req.token_decoded;

            const { query } = req.headers;

            if(!query){
                return res.status(400).json({
                    error:{
                        path:'product_id',
                        msg:'Nenhum product_id foi recebido!'
                    }
                });
            }

            const whereVisibility = await buildWhereVisibility(
                employee_id
            );

            const data = await Product.findAndCountAll({

                where:{
                    ...whereVisibility,
                    product_id: Number(query)
                },

                distinct:true,

                include:[
                    {
                        model: Brand,
                        as:'brandProduct'
                    },
                    {
                        model: Category,
                        as:'categoryProduct'
                    },
                    {
                        model: Thumbnails,
                        as:'thumbnails',
                        required:false
                    },
                ]

            });

            return res.json(data);

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

    getByGTIN: async (req, res) => {

        try {

            const { employee_id } = req.token_decoded;

            const { size, page } = paginateDefine(req);

            const { gtin } = req.headers;

            if(!gtin){

                return res.status(400).json({
                    error:{
                        path:'GTIN',
                        msg:'Nenhuma referência recebida!'
                    }
                });

            }

            const whereVisibility = await buildWhereVisibility(
                employee_id
            );

            const data = await Product.findAndCountAll({

                where:{
                    ...whereVisibility,

                    GTIN:{
                        [Op.like]: `${gtin}%`
                    }
                },

                limit: size,

                offset: size * (page - 1),

                distinct:true,

                include:[
                    {
                        model: Brand,
                        as:'brandProduct'
                    },
                    {
                        model: Category,
                        as:'categoryProduct'
                    },
                    {
                        model: Thumbnails,
                        as:'thumbnails',
                        required:false
                    },
                ]

            });

            return res.json(data);

        } catch (error) {

            console.log(error);

            return res.status(500).json(error);

        }

    },

};

module.exports = product_search_controller;