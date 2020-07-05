const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// conect to db
mongoose.connect(
    process.env.DB_CONNECT, 
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log('Connected to db!!')
);

// body parser
app.use(express.json());

// routes
const authRoutes = require('./src/routes/auth');
const productsRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');

// routes middlewares
app.use('/api/v1/user', authRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);

// start up
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST);
console.log(`Server is up on http://${HOST}:${PORT}`);