const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();

/**
 * -------------- DATABASE CFG ----------------
 *
 * Author: Pedro Henrique Rincon Santos
 *
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * strings into the `.env` file
 * 
 * STAGE='DEV' or 'PROD'
 * 
 * MONGODB_KEY_DEV= <your development database string> (example: ongodb://<user>:<password>@localhost:27017/database_name)
 * MONGODB_KEY_PROD= <your production database string>
   
   + usage:
   
   " import { startMongo } from "./config/database"
   require('dotenv').config()

   startMongo(); "
   
 */ 

export const startMongo = async () => {
    const dbConnection = <string>process.env.STAGE === 'PROD' ? <string>process.env.MONGODB_KEY_PROD : <string>process.env.MONGODB_KEY_DEV;
    try {
        await mongoose.connect(String(dbConnection), {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("+ Connecting to MongoDB...");
        mongoose.connection.on('connected', () => {
            console.log('+ You are connected to MongoDB!');
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export const printMongooseState = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log('+ Mongoose is connected to MongoDB!');
        return 1;
    } else if(mongoose.connection.readyState == 2){
        console.log('+ Mongoose is connecting to MongoDB...');
        return 2;
    }  
    else if(mongoose.connection.readyState == 3){
        console.log('- Mongoose is disconnecting from MongoDB...');
        return 3;
    } 
    else if(mongoose.connection.readyState == 4){
        console.log('- Mongoose is disconnected from MongoDB!');
        return 4;
    }
}

module.exports = {
    startMongo,
    printMongooseState
};
  