const {Product} =require('../database/models');

const paginateDefine = require('../functions/paginateDefine');
const remove_image = require('../functions/remove_image');

const product_crud_router = {
    create: async (req, res) => {
        try {
            const data = await Product.create(req.body)
            return res.json(data);

        } catch (error) {
            console.log(error);
            return res.status(401).json(error)
        }
    },
    read: async (req, res) => {
        try {
            const {size,page} = paginateDefine(req);

            console.log('req.body', req.body)

            const products = await Product.findAndCountAll({
                limit:size,
                offset: size* (page -1)
            })

            return res.json(products);
        } catch (error) {
            console.log(error);
            return res.status(401).json(error)
        }
    },
    update: async (req, res) => {
        try {
            const {product_id} = req.headers;
            
            const data = await Product.findByPk(product_id);
            req.file ? remove_image(data.thumbnails) : '';
            await data.update(req.body);

            return res.json(data);
        } catch (error) {
            console.log(error);
            return res.status(401).json(error)
        }
    },
    destroy: async (req, res) => {
        try {
            const {product_id} = req.headers;
        
            const data = await Product.findByPk(product_id);
            remove_image(data.thumbnails);

            await data.destroy();
            return res.json(`successfully deleted product_id = ${data}`);
            
        } catch (error) {
            console.log(error);
            return res.status(401).json(error)
        }
    },
};

module.exports = product_crud_router;
