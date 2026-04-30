const { Product, Brand, Category, Thumbnails } = require('../database/models');
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
            const thumbnails = req.files?.thumbnails || [];
            const advertisings = req.files?.advertisings || [];

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
            const { product_id, thumbnails_removed, movie_removed } = req.body;

        if (!product_id) {
            return res.status(400).json({ error: "product_id is required" });
        }

        const thumbnails = req.files?.thumbnails || [];
        const advertisings = req.files?.advertisings || [];

        if (movie_removed) {
        req.body.movie_url = null;
        }

        if (thumbnails_removed) {
        try {
            const idsToRemove = thumbnails_removed
            .split(',')
            .map(id => Number(id))
            .filter(Boolean);

            for (const id of idsToRemove) {
            const thumb = await Thumbnails.findByPk(id);

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
   

        const product = await Product.findByPk(product_id);

        await saveImages(product_id,thumbnails, 0);
        await saveImages(product_id,advertisings, 1);

        if (!product) {
        return res.status(404).json({ error: "Product not found" });
        }

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
