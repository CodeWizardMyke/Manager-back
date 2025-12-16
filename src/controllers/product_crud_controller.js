const { Product, Brand, Category, Thumbnails } = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');
const remove_image = require('../functions/remove_image');

const product_crud_router = {
    create: async (req, res) => {
        try {
            const { thumbnail_length, advertising_length } = req.body;

            // cria o produto
            const product = await Product.create(req.body);

            const images = req.body.images ?? [];
            console.log('req.body', req.body)

            const thumbnails = images.slice(0, Number(thumbnail_length));
            const advertisings = images.slice(
                Number(thumbnail_length),
                Number(thumbnail_length) + Number(advertising_length)
            );

            // função genérica de salvar
            const saveImages = async (paths, type) => {
                if (!paths.length) return;

                for (const path of paths) {
                    await Thumbnails.create({
                        fk_product_id: product.product_id,
                        path,
                        type
                    });
                }
            };

           const thumbsave =  await saveImages(thumbnails, 0);
            const advertsave = await saveImages(advertisings, 1);

            console.log('thumbsave', thumbnails)
            console.log('advertsave', advertisings)

            //return res.json(product);

        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    read: async (req, res) => {
        try {
            const { size, page } = paginateDefine(req);

            const products = await Product.findAndCountAll({
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
            const { product_id, thumbnails_removed, thumbnail_length, advertising_length } = req.body;

            if(thumbnails_removed && thumbnails_removed !== ""){
                const imagesToRemovedById = thumbnails_removed.split(',').map(id => Number(id));
                console.log('createArrayId', imagesToRemovedById)

                for (const id of imagesToRemovedById) {
                    const thumb = await Thumbnails.findByPk(id);
                    if (thumb) {
                      remove_image(thumb.path);
                      await thumb.destroy();
                    }
                  }
                  
            }

            if(thumbnail_length && thumbnail_length > 0){
                const thumbnails = req.body.images.slice(0, Number(thumbnail_length));
                for (const fileName of thumbnails) {
                    await Thumbnails.create({
                      fk_product_id: Number(product_id),
                      path: fileName,
                      type: 0
                    });
                  }
            }

            if(advertising_length && advertising_length > 0){
                console.log('adicionando advertising')
                const advertisings = req.body.images.slice( Number(thumbnail_length), Number(thumbnail_length) + Number(advertising_length) );

                for (const fileName of advertisings) {
                    await Thumbnails.create({
                      fk_product_id: Number(product_id),
                      path: fileName,
                      type: 1
                    });
                  }
            };

            const product = await Product.findByPk(product_id);
            await product.update(req.body);

            const updated = await Product.findOne({
                where: { product_id },
                include: [
                    { model: Brand, as: 'brandProduct' },
                    { model: Category, as: 'categoryProduct' },
                    { model: Thumbnails, as: 'thumbnails', require: false }
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

            if(!product_id) return res.status(400).json('product_id is required in headers');

            const product = await Product.findByPk(product_id);

            if(!product) return res.status(404).json(`product_id =${product_id} not found`);

            const thumbnails = await Thumbnails.findAll({
                where: { fk_product_id: product_id }
            });

            for (const thumb of thumbnails) {
                remove_image(thumb.path);
                await thumb.destroy();
            }
            
            await product.destroy();
            
            return res.json(`successfully deleted product_id =${product_id}`);

        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }
};

module.exports = product_crud_router;
