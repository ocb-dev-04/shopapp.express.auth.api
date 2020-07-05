const Joi = require('@hapi/joi');

const registerValidation = async (body) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.ref('password'),
    }).with('password', 'confirm_password');

    return schema.validateAsync(body);
}

const loginValidation = async (body) => {
    const schema = Joi.object().keys({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validateAsync(body);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;