const router = require('express').Router();
const auth = require('../config/verify_token');
// local code
const Cart = require('../models/cart');
const Products = require('../models/products');
const {
    registerValidation,
    updateValidation
} = require('../models/validations/cart_validations');

// private
router.get('/get_all', auth, async (req, res) => {
    try {
        console.log(req.user._id);
        
        const product = await Cart.find({user_id: req.user._id});
        let totalPrice = 0.00;
        let totalProducts = 0;
        product.forEach((item) => {
            totalPrice += item.price * item.count;
            totalProducts += item.count;
        });
        
        res.send({ totalProducts, totalPrice, product });
    } catch (error) {
        res.status(404).send({ message: 'No are any products registed with this id' });
    }
});

router.post('/create', auth, async (req, res) => {
    try {
        const { product_id, count } = req.body;

        const { error } = await registerValidation(req.body);
        if (error) return res.status(400).send({ error: error.details[0].message });

        // find by id the product info
        const productInfo = await Products.findById(product_id);
        if(!product_id) return res.status(404).send({error: 'Product not exist'});

        const addToCart = new Cart({ user_id: req.user._id, product_id, product_name: productInfo.name, price: productInfo.price, count });
        const create = await addToCart.save();
        
        res.status(201).send({ message: { user_id: req.user._id, product_id, count } });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.put('/update', auth, async (req, res) => {
    try {
        const { _id, count } = req.body;

        const { error } = await updateValidation(req.body);
        if (error) return res.status(400).send({ error: error.details[0].message });

        // find by id the product info
        const cartInfo = await Cart.findById(_id);
        if(!cartInfo) return res.status(404).send({error: 'Product not exist on cart'});
        cartInfo.count = count;// change the count
        const update = await Cart.findByIdAndUpdate(_id, cartInfo);
        
        res.status(201).send({ message: { user_id: req.user._id, product_id: cartInfo.product_id, count } });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const productExistOnCart = await Cart.findById(req.params.id);
        if (!productExistOnCart) return res.status(400).send({ error: 'Product not exist on cart' });
        if(!productExistOnCart.user_id === req.user._id) return res.status(400).send({error: 'You cannot update a product you did not create'});
        
        const deleteFromCart = await Cart.findByIdAndDelete(productExistOnCart._id);

        res.status(201).send({ message: { deleted_product_id: productExistOnCart._id, deleted_product_name: productExistOnCart.name} });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

module.exports = router;