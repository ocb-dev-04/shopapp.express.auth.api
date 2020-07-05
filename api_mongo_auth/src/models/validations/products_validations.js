const Joi = require('@hapi/joi');

const registerValidation = async (body) => {
    const schema = Joi.object().keys({
        image_url: Joi.string(),
        name: Joi.string().min(6).max(255).required(),
        description: Joi.string().min(10).max(1024).required(),
        price: Joi.number().required(),
        stock: Joi.number().required(),
    });
    
    return schema.validateAsync(body);
}

const updateValidation = async (body) => {
    const schema = Joi.object().keys({
        image_url: Joi.string(),
        name: Joi.string().min(6).max(255).required(),
        description: Joi.string().min(10).max(1024).required(),
        price: Joi.number().required(),
        stock: Joi.number().required(),
    });

    return schema.validateAsync(body);
}

module.exports.registerValidation = registerValidation;
module.exports.updateValidation = updateValidation;