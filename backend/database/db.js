import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const DBConfig = async()=>{
    const MONGO_URL = process.env.MONGODB_URL;
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Connected to database");
    }
    catch (err){
        console.error("Error while connecting to database: ", err); 
    }
}

export default DBConfig;