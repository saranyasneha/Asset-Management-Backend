const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

//import all the routes
const auth=require('./routes/auth');
const user=require('./routes/user')

app.use("/auth",auth);
app.use("/user",user);

module.exports=app;
