const router = require('express').Router();
const auth = require('../config/verify_token');
// local code
const Products = require('../models/products');
const {
    registerValidation,
    updateValidation
} = require('../models/validations/products_validations');

// public
router.get('/get_count', async (req, res) => {
    try {
        const count = await Products.countDocuments();
        res.send({ count });
    } catch (error) {
        res.status(404).send({ message: 'No are any products registed' });
    }

    res.send({ products: { name: 'Pomada', description: 'Para acelerar cicatrizacion', stock: 90, price: 345.95 } });
});

router.get('/get_all', async (req, res) => {
    try {
        const products = await Products.find({});
        res.send({ products });
    } catch (error) {
        res.status(404).send({ message: 'No are any products registed' });
    }

    res.send({ products: { name: 'Pomada', description: 'Para acelerar cicatrizacion', stock: 90, price: 345.95 } });
});

router.get('/id/:id', async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        res.send({ product });
    } catch (error) {
        res.status(404).send({ message: 'No are any products registed with this id' });
    }
});

router.get('/name/:name', async (req, res) => {
    try {
        const product = await Products.findOne({ name: req.params.name });
        res.send({ product });
    } catch (error) {
        res.status(404).send({ message: 'No are any products registed with this name' });
    }
});

// private
router.post('/create', auth, async (req, res) => {
    try {
        const { image_url, name, description, price, stock } = req.body;

        const { error } = await registerValidation(req.body);
        if (error) return res.status(400).send({ error: error.details[0].message });

        const productExist = await Products.findOne({ name: name });
        if (productExist) return res.status(400).send({ error: 'Product name is already registered' });

        const newProduct = new Products({ user_id: req.user._id, image_url, name, description, price, stock });
        const create = await newProduct.save();

        res.status(201).send({ message: { owner_id: create.user_id, product_id: create._id, name: create.name } });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.put('/update/:id', auth, async (req, res) => {
    try {
        const { image_url, name, description, price, stock } = req.body;

        const { error } = await updateValidation(req.body);
        if (error) return res.status(400).send({ error: error.details[0].message });

        const productExist = await Products.findById(req.params.id);
        if (!productExist) return res.status(400).send({ error: 'ProductId not exist' });
        if(!productExist.user_id === req.user._id) return res.status(400).send({error: 'You cannot update a product you did not create'});
        
        const updateProduct = new Products({_id: productExist._id, image_url, name, description, price, stock});
        const update = await Products.findByIdAndUpdate(productExist._id, updateProduct);

        res.status(201).send({ message: { owner_id: update.user_id, product_id: update._id, name: update.name } });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const productExist = await Products.findById(req.params.id);
        if (!productExist) return res.status(400).send({ error: 'ProductId not exist' });
        if(!productExist.user_id === req.user._id) return res.status(400).send({error: 'You cannot update a product you did not create'});
        
        const deleteFromProduct = await Products.findByIdAndDelete(productExist._id);

        res.status(201).send({ message: { deleted_product_id: productExist._id, deleted_product_name: productExist.name} });
    } catch (err) {
        res.status(400).send({ error: err });
    }
    
});

module.exports = router;