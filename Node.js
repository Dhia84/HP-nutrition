const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const { cart } = req.body;
    const line_items = cart.map(item => ({
        price_data: {
            currency: 'eur',
            product_data
