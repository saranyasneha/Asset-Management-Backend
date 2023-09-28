// const express = require("express");
// const cors = require("cors");
// const nodemailer = require('nodemailer')
// const uuid = require("uuid");
// const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
require("dotenv").config();
const db = require("../../config/database");
// const app = express();
// app.use(express.json());
// app.use(cors())
// const jwtsecret = "jwt-secret-key"
exports.login=(req,res)=>{
    try {
        const { Email, Password } = req.body;
        console.log(Email);
        db.query('SELECT * FROM users WHERE Email=? ', [Email], async (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
            }
            console.log(results);
            if (results.length == 0) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }
            const user = results[0];
            const hashedPassword = user.Password;
            const passwordMatch = await bcrypt.compare(Password, hashedPassword);
            if (passwordMatch) {
                return res.status(200).json({ message: "Login successful!!!!" })
            } else {
                return res.status(400).json({ message: "Invalid credentials" })
            }
        })
    } catch (error) {
        console.log(error);
    }
   
}