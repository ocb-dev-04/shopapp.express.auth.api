const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// local code
const User = require('./../models/user');
const {registerValidation, loginValidation } = require('../models/validations/user_validations');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const { error } = await registerValidation(req.body);
        if(error) return res.status(400).send({error: error.details[0].message });        
        
        const userExist = await User.findOne({email: email});
        if(userExist) return res.status(400).send({error: 'Email is already registered'});

        const hashPass = await bcrypt.hash(password, await bcrypt.genSalt(18));
        const newUser = new User({ name, email, password: hashPass });
        const create = await newUser.save();
        res.status(201).send({ message: { id: create._id, email: create.email } });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { error } = await loginValidation(req.body);
        if(error) return res.status(400).send({error: error.details[0].message });        
        
        const userExist = await User.findOne({email: email});
        if(!userExist) return res.status(400).send({error: 'Email doesn\'t exist!!'});

        const validPass = await bcrypt.compare(password, userExist.password);
        if(!validPass) return res.status(400).send({error: 'Password is incorrect'});

        const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET);
        res.header('auth-token', token).send({ token });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

module.exports = router;