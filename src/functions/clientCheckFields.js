const {check} = require('express-validator');

const clientCheckFields = {
    clientCreate:[
        check('clientName').notEmpty().withMessage('Nome do cliente não foi definido.').trim(),
        check('clientInstagram').notEmpty().withMessage("Instagram do cliente não foi definido.").trim()
    ]
}

module.exports = clientCheckFields;