import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

//Order Schema
const ordersSchema = mongoose.Schema({
    userName: {type: String, requried: true},
    orderType: {type: String, required: true},
    stock_title: {type: String, requried: true},
    strike_price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    executed: {type: Boolean, requried: true}},
    {collection: 'Orders', versionKey: false
});

const Orders = mongoose.model("Orders", ordersSchema);

const createOrder = async (userName, orderType, stock_title, strike_price, quantity, executed) => {
    const order = new Orders({userName: userName, 
                                    orderType: orderType, 
                                    stock_title: stock_title, 
                                    strike_price: strike_price,
                                    quantity: quantity,
                                    executed: executed});
    return order.save();
}

const findUserOrders = async (userName, executed) => {
    const query = Orders.find({userName: userName,
                                executed: executed});
    return query.exec();
}

const findUnexecutedOrder = async () => {
    const query = Orders.find({executed: false});
    return query.exec();
}

const replaceOrder = async (_id, userName, orderType, stock_title, strike_price, quantity, executed) =>{
    const result = await Orders.replaceOne(
        {_id: _id}, 
        {userName: userName, 
        orderType: orderType, 
        stock_title: stock_title, 
        strike_price: strike_price, 
        quantity: quantity,
        executed: executed}
    );
    return result.modifiedCount;
}

const deleteOrder = async (userName, orderType, stock_title) => {
    const result = await Orders.deleteOne({userName: userName,
                                            orderType: orderType,
                                            stock_title: stock_title});
    return result.deletedCount;
}

const executeOrder = async (_id) => {
    const result = await Orders.updateOne(
        {_id: _id},
        {$set: {executed:true}});
        return result.modifiedCount;
}


db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export {createOrder, findUserOrders, findUnexecutedOrder, replaceOrder, deleteOrder, executeOrder}