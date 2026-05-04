async function isHidden({
    hiddenModel,
    employee_id,
    field,
    value
}) {

    const exists = await hiddenModel.findOne({
        where:{
            fk_employee_id: employee_id,
            [field]: value
        }
    });

    return !!exists;
}

module.exports = {
    isHidden
};