const { Op } = require('sequelize');
const { Product, Brand, Category, Thumbnails, HiddenProduct } = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');
const remove_image = require('../functions/remove_image');

const saveImages = async (product_id, files, type) => {
    for (const file of files) {
        await Thumbnails.create({
        fk_product_id: product_id,
        path: `/${file.fieldname}/${file.filename}`,
        type
        });
    }
};

const product_crud_router = {
    create: async (req, res) => {
        try {
            const {employee_id} = req.token_decoded;

            const verifyProductsCreated = await Product.findAndCountAll({
                where:{
                    owner_employee_id:employee_id
                }
            })

            if(employee_id !== 1){
                if(verifyProductsCreated.count >= 2){
                    return res.status(401).json({errors: [{path:'demo',msg:'Valor máximo excedido na versão demo do projeto.'}] })
                }
            }

            const thumbnails = req.files?.thumbnails || [];
            const advertisings = req.files?.advertisings || [];
            
            if(employee_id !== 1){
                req.body.owner_employee_id = employee_id;
            }

            const product = await Product.create(req.body);

            await saveImages(product.product_id, thumbnails, 0);
            await saveImages(product.product_id, advertisings, 1);

            return res.json(product);

        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    read: async (req, res) => {
        try {
            const {employee_id} = req.token_decoded;

            const { size, page } = paginateDefine(req);

            const hiddenProducts = await HiddenProduct.findAll({
                where:{
                    fk_employee_id:employee_id
                },
                attributes:['fk_product_id']
            });

            const hiddenIds = hiddenProducts.map( 
                item => item.fk_product_id
            );

            const whereClauser = {  
                [Op.or]: [
                    { owner_employee_id: null },
                    { owner_employee_id: employee_id },
                ],
            };

            if(hiddenIds.length > 0){
                // serarando o where de hiddens id pq alguns bancos de dados podem dar problemas e criar slq estranhos caso nao houver ids no array
                whereClauser.product_id = {
                    [Op.notIn]: hiddenIds
                }
            }

            const products = await Product.findAndCountAll({
                where:whereClauser,
                limit: size,
                offset: size * (page - 1),
                distinct: true,
                include: [
                    { model: Brand, as: 'brandProduct' },
                    { model: Category, as: 'categoryProduct' },
                    { model: Thumbnails, as: 'thumbnails', require: false }
                ]
            });

            return res.json(products);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    update: async (req, res) => {
        try {
            const { product_id, thumbnails_removed, movie_removed } = req.body;

            const { employee_id } = req.token_decoded;

            if (!product_id) {
                return res.status(400).json({ error: "product_id is required" });
            };

            const isHidden = await HiddenProduct.findOne({
                where:{
                    fk_employee_id: employee_id,
                    fk_product_id: product_id
                }
            });
       
            if(isHidden ){
                return res.status(401).json({
                    errors:[{
                        path:'demo',
                        msg:'objeto de atualização inválido!'
                    }]
                });
            }

            const onwer = employee_id === 1 ? null : employee_id;
            
            const product = await Product.findOne({
                where:{
                    product_id,
                    owner_employee_id: onwer 
                }
            });
                    
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }

            const thumbnails = req.files?.thumbnails || [];
            const advertisings = req.files?.advertisings || [];

            if (movie_removed) { req.body.movie_url === "true"; }

            if (thumbnails_removed) {
                try {
                    const idsToRemove = thumbnails_removed
                    .split(',')
                    .map(id => Number(id))
                    .filter(Boolean);

                    for (const id of idsToRemove) {
                   const thumb = await Thumbnails.findOne({
                        where:{
                            thumbnail_id: id,
                            fk_product_id: product_id
                        }
                    });

                    if (!thumb) continue;

                    try {
                        remove_image(thumb.path); // remove do disco
                    } catch (err) {
                        console.warn("Erro ao remover arquivo físico:", thumb.path);
                    }

                    await thumb.destroy(); // remove do banco
                    }

                } catch (error) {
                    console.error("Erro ao processar remoção de imagens:", error);
                }
            }

            await saveImages(product_id,thumbnails, 0);
            await saveImages(product_id,advertisings, 1);

            await product.update(req.body);

            const updated = await Product.findOne({
                where: { product_id },
                include: [
                    { model: Brand, as: 'brandProduct' },
                    { model: Category, as: 'categoryProduct' },
                    { model: Thumbnails, as: 'thumbnails', required: false }
                ]
            });

            return res.json(updated);

        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    destroy: async (req, res) => {
        try {
            const { product_id } = req.headers;

            const { employee_id } = req.token_decoded;

            if (!product_id) {
                return res
                    .status(400)
                    .json('product_id is required in headers');
            }

            /*
                Verifica se o produto pertence ao usuário.
                Produtos globais NÃO podem ser deletados.
            */
            const product = await Product.findOne({
                where: {
                    product_id,
                    owner_employee_id: employee_id
                }
            });

            /*
                Se não encontrou produto do usuário,
                verifica se é um produto global.
            */
        if (!product) {

            const globalProduct = await Product.findOne({
                where: {
                    product_id,
                    owner_employee_id: null
                }
            });

            /*
                Produto global:
                apenas oculta para o usuário
            */
            if (globalProduct) {

                const alreadyHidden = await HiddenProduct.findOne({
                    where: {
                        fk_employee_id: employee_id,
                        fk_product_id: product_id
                    }
                });

                if (!alreadyHidden) {

                    await HiddenProduct.create({
                        fk_employee_id: employee_id,
                        fk_product_id: product_id,
                        expires_at: new Date(
                            Date.now() + 3 * 24 * 60 * 60 * 1000
                        )
                    });

                }

                return res.json({
                    msg: 'Produto ocultado da visualização do usuário.'
                });

            }

            return res.status(404).json({
                errors: [{
                    path: 'product',
                    msg: `product_id=${product_id} not found`
                }]
            });

        }

        /*
            Remove thumbnails do produto do usuário
        */
        const thumbnails = await Thumbnails.findAll({
            where: {
                fk_product_id: product_id
            }
        });

        for (const thumb of thumbnails) {

            try {

                remove_image(thumb.path);

            } catch (error) {

                console.warn(
                    'Erro ao remover imagem física:',
                    thumb.path
                );

            }

            await thumb.destroy();

        }

        /*
            Remove hidden references
            caso existam
        */
        await HiddenProduct.destroy({
            where: {
                fk_product_id: product_id
            }
        });

        /*
            Remove produto
        */
        await product.destroy();

        return res.json({
            msg: `successfully deleted product_id=${product_id}`
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json(error);

    }
    }
};

module.exports = product_crud_router;
