// const express =require("express")
import express from "express"; //web framework routes middlewares etc
import dotenv from "dotenv";

import cors from "cors";

import path from "path";

import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import {app,server} from "./lib/socket.js";


 

dotenv.config()


const PORT=process.env.PORT||4000  //env var

const __dirname =path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true, //allow cookies or authorisation values
})
);


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/webchat/dist")));


    
}


app.use(express.urlencoded({ extended: true }));

server.listen(PORT,()=>{
    console.log("server is running on Port:"+PORT)
    connectDB()
});
