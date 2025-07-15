import 'dotenv/config';
import * as userInfo from './userInfo_model.mjs';
import express from 'express';
import { checkSchema, validationResult } from 'express-validator';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.post('/purchase', checkSchema({
    userName: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    stock_title: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    stock_sym: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    amountOwned: {notEmpty: true, isFloat: true, isFloat: {options: {gt: 0}}}
    }),
    (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()){
            userInfo.createUserStock(req.body.userName, req.body.stock_title, req.body.stock_sym, req.body.amountOwned)
            .then(info => {
                res.status(201).json(info);
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

app.post('/history/:userName', checkSchema({
    userName: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    stock_title: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    stock_sym: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    amount: {notEmpty: true, isFloat: true, isFloat: {options: {gt: 0}}},
    transactionType: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    price: {notEmpty: true, isFloat: true, isFloat: {options: {gt: 0}}},
    }),
    (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()){
            userInfo.addHistory(req.body.userName, 
                                req.body.stock_title, 
                                req.body.stock_sym, 
                                req.body.amount,
                                req.body.transactionType,
                                req.body.price)
            .then(info => {
                res.status(201).json(info);
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

app.get('/history/:userName', (req, res) => {
    const user = req.params.userName;
    userInfo.findAllUserHistory(user)
    .then(userInfo => {
        res.json(userInfo);
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Request failed'});
    })
});

app.get('/user/:userName', (req, res) => {
    const user = req.params.userName;
    userInfo.findAllUserStocks(user)
    .then(userInfo => {
        res.json(userInfo);
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Request failed'});
    })
});

app.get('/user/:userName/:stock_title', (req, res) => {
    const user = req.params.userName;
    const stock = req.params.stock_title
    userInfo.findUserStockByUserName(user, stock)
    .then(userInfo => {
        res.json(userInfo);
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Request failed'});
    })
});

app.put('/user/:userName/:stock', (req, res) => {
    userInfo.replaceUserStock(req.params.userName, req.params.stock, req.body.amountOwned)
    .then(modifiedCount => {
        if (modifiedCount === 1){
            res.json({amountOwned: req.body.amountOwned})
        } else {
            res.status(404).json({Error: 'Resource not found'});
        }
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Request failed'});
    });

});

app.delete('/user/:userName/:stock', (req, res) => {
    userInfo.deleteById(req.params.userName, req.params.stock)
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