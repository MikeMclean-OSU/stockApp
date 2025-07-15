import 'dotenv/config';
import * as userFunds from './userFunds_model.mjs';
import express from 'express';
import { checkSchema, validationResult } from 'express-validator';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.post('/new_funds', checkSchema({
    userName: {notEmpty: true, isLength: {options: {min: 1}}, isString: true},
    funds: {notEmpty: true, isFloat: true, isFloat: {options: {gt: 0}}}
    }),
    (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()){
            userFunds.createUserFunds(req.body.userName, req.body.funds)
            .then(funds => {
                res.status(201).json(funds);
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


app.get('/funds/:userName', (req, res) => {
    const user = req.params.userName;
    userFunds.findFundsByUserName(user)
    .then(userFunds => {
        res.json(userFunds);
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Request failed'});
    })
});

app.put('/funds/:userName', (req, res) => {
    userFunds.replaceUserFunds(req.params.userName, req.body.funds)
    .then(modifiedCount => {
        if (modifiedCount === 1){
            res.json({funds: req.body.funds})
        } else {
            res.status(404).json({Error: 'Resource not found'});
        }
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Request failed'});
    });

});

app.delete('/funds/:userName', (req, res) => {
    userFunds.deleteByUsername(req.params.userName)
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