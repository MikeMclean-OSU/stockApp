import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */
const stockSchema = mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    sym: { type: String, required: true }},
    {collection:'stocks', versionKey: false
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Stock = mongoose.model("Stock", stockSchema);

const createStock = async (title, price, sym) => {

    const stock = new Stock({title: title, price: price, sym: sym});
    return stock.save();
}

const findStock = async (filter) => {
    const query = Stock.find(filter);
    return query.exec();
}

const findStockByID = async (_id) => {
    const query = Stock.findOne({_id: _id})
    return query.exec();
}

const replaceStock = async (_id, title, price, sym) =>{
    const result = await Stock.replaceOne({_id: _id}, {title: title, price: price, sym: sym})
    return result.modifiedCount
}

const deleteById = async (_id) => {
    const result = await Stock.deleteOne({ _id: _id });
    return result.deletedCount;
}

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export {createStock, findStock, deleteById, findStockByID, replaceStock};
