import mongoose from "mongoose";

const DB = process.env.MONGODB_URI;

const DataBaseConnection =()=>{
    mongoose.connect(DB).then((con)=>{
        console.log("Connected to MongoDB Successfully!");
    }).catch((err)=>{
        console.log("Failed to connect to MongoDB", err);
    });
};

export default DataBaseConnection;

// Connect to MongoDB