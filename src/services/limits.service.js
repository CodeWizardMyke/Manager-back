async function validateDemoLimit({
    model,
    employee_id,
    limit = 2
}) {

    if(employee_id === 1){
        return false;
    }

    const total = await model.count({
        where:{
            owner_employee_id: employee_id
        }
    });

    return total >= limit;
}

module.exports = {
    validateDemoLimit
};