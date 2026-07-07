const { Op } = require('sequelize');

const {
    Product,
    Brand,
    Category,
    Thumbnails,
    HiddenProduct
} = require('../database/models');

const paginateDefine = require('../functions/paginateDefine');
const remove_image = require('../functions/remove_image');


const saveImages = async (product_id, files = [], type) => {

    if (!files.length) {
        return;
    }

    const images = files.map(file => ({
        fk_product_id: product_id,
        path: `/${file.fieldname}/${file.filename}`,
        type
    }));

    await Thumbnails.bulkCreate(images);
};

const removeImages = async (product_id, ids = []) => {

    if (!ids.length) {
        return;
    }


    // trata array vindo do multipart
    if (
        ids.length === 1 &&
        typeof ids[0] === "string" &&
        ids[0].startsWith("[")
    ) {
        ids = JSON.parse(ids[0]);
    }


    ids = ids.map(Number);


    const thumbnails = await Thumbnails.findAll({
        where: {
            thumbnail_id: ids,
            fk_product_id: product_id
        }
    });


    if (!thumbnails.length) {
        console.log("Nenhuma imagem encontrada");
        return;
    }


    thumbnails.forEach(image => {

        try {
            remove_image(image.path);
        } catch(error){
            console.warn(
                "Erro removendo arquivo:",
                image.path
            );
        }

    });


    await Thumbnails.destroy({
        where:{
            thumbnail_id: thumbnails.map(
                image => image.thumbnail_id
            )
        }
    });

};
const product_crud_controller = {


    create: async (req,res)=>{

        try {

            const { employee_id } = req.token_decoded;


            const count = await Product.count({
                where:{
                    owner_employee_id: employee_id
                }
            });


            if(employee_id !== 1 && count >= 200){

                return res.status(401).json({
                    errors:[
                        {
                            path:"demo",
                            msg:"Valor máximo excedido na versão demo do projeto."
                        }
                    ]
                });

            }


            if(employee_id !== 1){
                req.body.owner_employee_id = employee_id;
            }


            const product = await Product.create(req.body);


            await saveImages(
                product.product_id,
                req.files?.thumbnails,
                0
            );


            await saveImages(
                product.product_id,
                req.files?.advertisings,
                1
            );


            return res.json(product);


        } catch(error){

            console.log(error);

            return res.status(500).json(error);

        }

    },



    read: async(req,res)=>{

        try {

            const { employee_id } = req.token_decoded;

            const {size,page} = paginateDefine(req);


            const hidden = await HiddenProduct.findAll({

                where:{
                    fk_employee_id:employee_id
                },

                attributes:[
                    "fk_product_id"
                ]

            });


            const hiddenIds = hidden.map(
                item=>item.fk_product_id
            );



            const where = {

                [Op.or]:[
                    {
                        owner_employee_id:null
                    },
                    {
                        owner_employee_id:employee_id
                    }
                ]

            };



            if(hiddenIds.length){

                where.product_id = {
                    [Op.notIn]:hiddenIds
                };

            }



            const products = await Product.findAndCountAll({

                where,

                limit:size,

                offset:size * (page - 1),

                distinct:true,

                include:[
                    {
                        model:Brand,
                        as:"brandProduct"
                    },
                    {
                        model:Category,
                        as:"categoryProduct"
                    },
                    {
                        model:Thumbnails,
                        as:"thumbnails",
                        required:false
                    }
                ]

            });



            return res.json(products);


        } catch(error){

            console.log(error);

            return res.status(500).json(error);

        }

    },



    update: async(req,res)=>{

        try {


            let {
                product_id,
                thumbnails_removed = [],
                movie_removed
            } = req.body;



            // garante array
            if(!Array.isArray(thumbnails_removed)){
                thumbnails_removed = [
                    thumbnails_removed
                ];
            }

            const {
                employee_id
            } = req.token_decoded;



            const owner =
                employee_id === 1
                ? null
                : employee_id;



            const product = await Product.findOne({

                where:{
                    product_id,
                    owner_employee_id:owner
                }

            });


            if(!product){

                return res.status(404).json({
                    error:"Product not found"
                });

            }



            await removeImages(
                product_id,
                thumbnails_removed
            );



            await saveImages(
                product_id,
                req.files?.thumbnails,
                0
            );


            await saveImages(
                product_id,
                req.files?.advertisings,
                1
            );



            if(movie_removed){
                req.body.movie_url = null;
            }



            await product.update(req.body);



            const updated = await Product.findOne({

                where:{
                    product_id
                },


                include:[
                    {
                        model:Brand,
                        as:"brandProduct"
                    },
                    {
                        model:Category,
                        as:"categoryProduct"
                    },
                    {
                        model:Thumbnails,
                        as:"thumbnails",
                        required:false
                    }
                ]

            });



            return res.json(updated);



        } catch(error){

            console.log(error);

            return res.status(500).json(error);

        }

    },



    destroy: async(req,res)=>{

        try {


            const {
                product_id
            } = req.headers;



            const {
                employee_id
            } = req.token_decoded;



            if(!product_id){

                return res.status(400).json(
                    "product_id is required in headers"
                );

            }



            const product = await Product.findOne({

                where:{
                    product_id,
                    owner_employee_id:employee_id
                }

            });



            if(!product){

                const globalProduct = await Product.findOne({

                    where:{
                        product_id,
                        owner_employee_id:null
                    }

                });



                if(globalProduct){


                    const hidden =
                    await HiddenProduct.findOne({

                        where:{
                            fk_employee_id:employee_id,
                            fk_product_id:product_id
                        }

                    });



                    if(!hidden){

                        await HiddenProduct.create({

                            fk_employee_id:employee_id,

                            fk_product_id:product_id,

                            expires_at:
                            new Date(
                                Date.now()
                                +
                                3*24*60*60*1000
                            )

                        });

                    }



                    return res.json({

                        msg:"Produto ocultado."

                    });

                }



                return res.status(404).json({

                    error:"Product not found"

                });

            }



            const thumbnails = await Thumbnails.findAll({

                where:{
                    fk_product_id:product_id
                }

            });



            thumbnails.forEach(image=>{

                remove_image(image.path);

            });



            await Thumbnails.destroy({

                where:{
                    fk_product_id:product_id
                }

            });



            await HiddenProduct.destroy({

                where:{
                    fk_product_id:product_id
                }

            });



            await product.destroy();



            return res.json({

                msg:"Produto removido"

            });



        } catch(error){

            console.log(error);

            return res.status(500).json(error);

        }

    }


};


module.exports = product_crud_controller;