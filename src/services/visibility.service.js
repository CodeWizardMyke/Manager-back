const { Op } = require('sequelize');

async function buildVisibilityWhere({
    employee_id,
    hiddenModel,
    hiddenField,
    ownerField = 'owner_employee_id',
    entityField
}) {

    const hiddenItems = await hiddenModel.findAll({
        where:{
            fk_employee_id: employee_id
        },
        attributes:[hiddenField]
    });

    const hiddenIds = hiddenItems.map(
        item => item[hiddenField]
    );

    const where = {
        [Op.or]: [
            { [ownerField]: null },
            { [ownerField]: employee_id }
        ]
    };

    if(hiddenIds.length){

        where[entityField] = {
            [Op.notIn]: hiddenIds
        };

    }

    return where;
}

module.exports = {
    buildVisibilityWhere
};