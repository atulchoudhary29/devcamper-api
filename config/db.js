const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: 'config\config.env' });

const uri = process.env.MONGO_URI || "mongodb+srv://jatatul7:atul12345@cluster0.tiibnid.mongodb.net/devcamper?retryWrites=true&w=majority";
const connectDB = async () => {
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
};

module.exports = connectDB;