const mongoose = require('mongoose');

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * STAGE=DEV or PROD
 * 
 * MONGODB_KEY_DEV=mongodb://<user>:<password>@localhost:27017/database_name
 * MONGODB_KEY_PROD=<your production database string>
 */ 

export const startMongo = async () => {
    const dbConnection = process.env.STAGE === 'PROD' ? process.env.MONGODB_KEY_PROD : process.env.MONGODB_KEY_DEV;
    try {
        await mongoose.connect(dbConnection);
        console.log("+ Connecting to MongoDB...");
        mongoose.connection.on('connected', () => {
            console.log('+ Successfully connected to MongoDB!');
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = {
    startMongo
};
  