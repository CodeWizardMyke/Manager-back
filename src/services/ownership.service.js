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

module.exports = {
    findVisibleEntity
};