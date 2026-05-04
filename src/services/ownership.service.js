const { Op } = require('sequelize');

async function findVisibleEntity({
    model,
    employee_id,
    idField,
    idValue
}) {
    return await model.findOne({
        where:{
            [idField]: idValue,
            [Op.or]: [
                { owner_employee_id: null },
                { owner_employee_id: employee_id }
            ]
        }
    });
}

/*
   valida ownership via relacionamento 
*/
async function validateCartOwnership({
    cart_id,
    employee_id,
    Cart,
    Client
}) {

    return await Cart.findOne({
        where:{ cart_id },
        include:[
            {
                model: Client,
                as: 'client',
                required: true,
                where:{
                    owner_employee_id: employee_id
                }
            }
        ]
    });

}

module.exports = {
    findVisibleEntity,
    validateCartOwnership
};