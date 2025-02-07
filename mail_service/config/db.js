import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseName = "test";
const MONGO_URI = process.env.MONGO_URI;

// Create a MongoClient instance outside of the functions to ensure reuse
const client = new MongoClient(MONGO_URI);

// Function to connect to the database
const connectDB = async () => {
  try {
    await client.connect(); // Connect to the MongoDB cluster
    const database = client.db(databaseName); // Access the database
    console.log(`Connected to database: ${databaseName}`);
    return database; // Return the database instance for further use
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};



const connectMongoose = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongoose connected to MongoDB");
  } catch (error) {
    console.error(`Mongoose connection error: ${error.message}`);
    throw error;
  }
};




export { connectDB, connectMongoose };



