import 'dotenv/config';
import * as orders from './orders_model.mjs';
import express from 'express';
import { checkSchema, validationResult } from 'express-validator';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.post('/new_order', checkSchema({
    userName: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    orderType: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    stock_title: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    strike_price: {notEmpty: true, isFloat: true, isFloat: {options: {gt: 0}}},
    quantity: {notEmpty: true, isFloat: true, isFloat: {options: {gt: 0}}},
    executed: {notEmpty: true, isBoolean: true}
    }), 
    (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()){
            orders.createOrder(req.body.userName, 
                                req.body.orderType, 
                                req.body.stock_title, 
                                req.body.strike_price, 
                                req.body.quantity,
                                req.body.executed)
            .then(order => {
                res.status(201).json(order);
            })
            .catch(err =>{
                console.error(err);
                res.status(500).json({Error: 'Internal Server Error'})
            });
        } else {
            console.error(result.array());
            res.status(400).json({Error: 'invalid request', details: result.array()});
        }
    });


app.get('/orders/:userName', (req, res) => {
    const user = req.params.userName;
    const executed = req.body.executed;
    orders.findUserOrders(user, executed)
    .then(orders => {
        res.json(orders);
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Request failed'});
    })
});

app.put('/orders/:userName/:stock_title', (req, res) => {
    orders.replaceOrder(req.params.userName, 
                        req.body.orderType, 
                        req.params.stock_title, 
                        req.body.strike_price, 
                        req.body.quantity,
                        req.body.executed)
    .then(modifiedCount => {
        if (modifiedCount === 1){
            res.json({strike_price: req.body.strike_price})
        } else {
            res.status(404).json({Error: 'Resource not found'});
        }
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Request failed'});
    });

});

app.delete('/orders/:userName/:stock_title', (req, res) => {
    orders.deleteOrder(req.params.userName, req.body.orderType, req.params.stock_title)
        .then(deletedCount => {
            if (deletedCount === 1){
                res.status(204).send();
            } else{
                res.status(404).json({ Error: 'Resource not found'})
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed'})
        })
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});