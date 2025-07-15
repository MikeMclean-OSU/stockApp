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
const userFundsSchema = mongoose.Schema({
    userName: {type: String, requried: true},
    funds: {type: Number, requried: true}},
    {collection: 'User Funds', versionKey: false
});

const UserFunds = mongoose.model("UserFunds", userFundsSchema);

const createUserFunds = async (userName, funds) => {
    const userStock = new UserFunds({userName: userName, funds: funds});
    return userStock.save();
}

const findFundsByUserName = async (userName) => {
    const query = UserFunds.findOne({userName: userName});
    return query.exec();
}

const replaceUserFunds = async (userName, funds) =>{
    const result = await UserFunds.replaceOne(
        {userName: userName}, 
        {userName: userName, funds:funds}
    );
    return result.modifiedCount;
}

const deleteByUsername = async (userName) => {
    const result = await UserFunds.deleteOne({userName: userName});
    return result.deletedCount;
}

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export {createUserFunds, findFundsByUserName, replaceUserFunds, deleteByUsername}