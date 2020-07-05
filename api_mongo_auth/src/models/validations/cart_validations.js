const Joi = require('@hapi/joi');

const registerValidation = async (body) => {
    const schema = Joi.object().keys({
        _id: Joi.string().required(),
        count: Joi.number().required(),
    });
    
    return schema.validateAsync(body);
}

const updateValidation = async (body) => {
    const schema = Joi.object().keys({
        _id: Joi.string().required(),
        count: Joi.number().required(),
    });

    return schema.validateAsync(body);
}

module.exports.registerValidation = registerValidation;
module.exports.updateValidation = updateValidation;