const {Product,Brand,Category, Thumbnails} =require('../database/models');

const paginateDefine = require('../functions/paginateDefine');
const remove_image = require('../functions/remove_image');

const product_crud_router = {
    create: async (req, res) => {
        try {
            const {thumbnail_length, advertising_length, thumbnails } = req.body;
            const response = await Product.create(req.body)
            
            const getThumbnails = thumbnails.slice(0,thumbnail_length);
            getThumbnails.forEach( async element => {
                await Thumbnails.create({
                    'fk_product_id': response.product_id,
                    'path': element,
                    'type':0
                })
            }); 

            const getAdvertisings = thumbnails.slice( thumbnail_length , Number(advertising_length) + Number(thumbnail_length) );
            getAdvertisings.forEach( async element => {
                await Thumbnails.create({
                    'fk_product_id': response.product_id,
                    'path': element,
                    'type':1
                })
            }); 
            
            return res.json(response);
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
                offset: size* (page -1),
                include:[
                    {model:Brand},
                    {model:Category},
                    {model:Thumbnails, as: 'productThumbnails'}
                ]
            })

            return res.json(products);
        } catch (error) {
            console.log(error);
            return res.status(401).json(error)
        }
    },
    update: async (req, res) => {
        try {
            const {product_id,thumbnails_removed,filesCreate} = req.body;
            
            if(thumbnails_removed){
                thumbnails_removed.forEach( async element => {
                    const removeThis = await Thumbnails.findByPk(Number(element));
                    remove_image(removeThis.path);
                    await removeThis.destroy();
                });
            };

            if(filesCreate){
                filesCreate.forEach( async element => {
                    await Thumbnails.create(element)
                })
            }

            const data = await Product.findByPk(product_id);
            await data.update(req.body);

            const updated = await Product.findOne({
                where:{product_id:product_id},
                include:[
                    {model:Category},
                    {model:Brand},
                    {model:Thumbnails, as:'productThumbnails'},
                ]
            })

           return res.json(updated);
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
