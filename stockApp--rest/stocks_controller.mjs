import 'dotenv/config';
import * as stocks from './stocks_model.mjs';
import express from 'express';
import { checkSchema, validationResult } from 'express-validator';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
 * Create a new stock with the title, year and language provided in the body
 */
app.post('/stocks', checkSchema({
    title: {notEmpty: true, isLength: {options: {min: 1}}, isString: true}, 
    price: {notEmpty: true, isFloat: true, isFloat: {options: {gt: 0}}}, 
    sym: {notEmpty: true, isLength: {options: {min: 1}}, isString: true}
    }),
    (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()){
            stocks.createStock(req.body.title, req.body.price, req.body.sym)
    .then(stock => {
        res.status(201).json(stock);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({Error:'Internal Server Error'});
    });
    
    }   else{
            console.error(result.array());
            res.status(400).json({ Error: 'Invalid request', details: result.array()});
    }

    });


/**
 * Retrive the stock corresponding to the ID provided in the URL.
 */
app.get('/stocks/:_id', (req, res) => {
    const stockID = req.params._id;
    stocks.findStockByID(stockID)
    .then(stock => {
        if (stock !== null){
            res.json(stock);
        } else {
            res.status(404).json({ Error: 'Resource not found'});
        }

    })
    .catch(error => {
        console.error(error);
        res.status(400).json({ Error: 'Request failed'});
    })
});

/**
 * Retrieve stocks. 
 * If the query parameters include a year, then only the stocks are returned.
 * Otherwise, all stock are returned.
 */
app.get('/stocks', (req, res) => {
    let filter = {};
    stocks.findStock(filter)
        .then(stocks => {
            res.json(stocks);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed'});
        })
});

/**
 * Update the stock whose id is provided in the path parameter and set
 * its title, year and language to the values provided in the body.
 */
app.put('/stocks/:_id', (req, res) => {
    stocks.replaceStock(req.params._id, req.body.title, req.body.price, req.body.sym)
        .then(modifiedCount => {
            if (modifiedCount === 1){
                res.json({_id: req.params._id, title: req.body.title, price: req.body.price, sym: req.body.sym})
            } else {
                res.status(404).json({ Error: 'Resource not found'});
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed'});
        });
});

/**
 * Delete the mstock whose id is provided in the query parameters
 */
app.delete('/stocks/:_id', (req, res) => {
    stocks.deleteById(req.params._id)
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
