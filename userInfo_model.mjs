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

//User Schema
const userStockSchema = mongoose.Schema({
    userName: {type: String, requried: true},
    stock_title: {type: String, requried: true},
    stock_sym: {type: String, requried: true},
    amountOwned: {type: Number, required: true}},
    {collection: 'Profile Information', versionKey: false
});

const UserStock = mongoose.model("UserStock", userStockSchema);

const userHistorySchema = mongoose.Schema({
    userName: {type: String, required: true},
    stock_title: {type: String, required: true},
    stock_sym: {type: String, required: true},
    amount: {type: Number, required: true},
    transactionType: {type: String, enum: ["Buy", "Sell"], required: true},
    price: {type: Number, required: true},
    timestamp: {type: Date, default: Date.now}},
    {collection: "Trading History", versionKey: false

});

const UserHistory = mongoose.model("TradingHistory", userHistorySchema);

const createUserStock = async (userName, stock_title, stock_sym, amountOwned) => {
    const userStock = new UserStock({userName: userName, 
                                    stock_title: stock_title, 
                                    stock_sym: stock_sym, 
                                    amountOwned: amountOwned});
    return userStock.save();
}

const findAllUserStocks = async (userName) => {
    const query = UserStock.find({userName: userName});
    return query.exec();
}

const findUserStockByUserName = async (userName, stock_title) => {
    const query = UserStock.findOne({userName: userName, stock_title: stock_title});
    return query.exec();
}

const replaceUserStock = async (userName, stock_title, amountOwned) =>{
    const result = await UserStock.replaceOne(
        {userName: userName, stock_title: stock_title}, 
        {userName: userName, stock_title: stock_title, amountOwned: amountOwned}
    );
    return result.modifiedCount;
}

const deleteById = async (userName, stock) => {
    const result = await UserStock.deleteOne({userName: userName, stock: stock});
    return result.deletedCount;
}

const addHistory = async (userName, stock_title, stock_sym, amount, transactionType, price) => {
    const trade = new UserHistory({userName: userName, 
                                    stock_title: stock_title, 
                                    stock_sym: stock_sym, 
                                    amount: amount, 
                                    transactionType: transactionType, 
                                    price: price});
    return trade.save();
};

const findAllUserHistory = async (userName) => {
    const query = UserHistory.find({userName: userName});
    return query.exec();
}


db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export {createUserStock, findUserStockByUserName, replaceUserStock, deleteById, findAllUserStocks, addHistory, findAllUserHistory}