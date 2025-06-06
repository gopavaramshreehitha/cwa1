import {config} from "dotenv";

config();

const seedUsers  =[
    // female users

    {
        email:"emma.thompson@example.com",
        fullName:"Emma Thompson",
        password:"123456",
        profilePic:""
    }
];


import {connectDB} from "../lib/db.js";

import User from "../models/user.model.js";

const seedDatabase =async() => {
    try {
        await connectDB();

        await User.insertMany(seedUsers);
    } catch (error) {
        console.error("Error seeding database:",error);
    }
}


seedDatabase();