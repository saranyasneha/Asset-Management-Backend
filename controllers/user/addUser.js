const uuid = require("uuid");
const bcrypt = require('bcrypt');
require("dotenv").config();
const db=require('..//../config/database')

exports.addUser=async(req,res)=>{
try {
    const { FirstName, LastName, Email, Password } = req.body;
    const userId = uuid.v4();
    const myEncPassword = await bcrypt.hash(Password, 10);
    db.query('SELECT * FROM users WHERE Email=?', [Email], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" })
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "User already exists!!" })
        }
        db.query('INSERT INTO users(ID,FirstName,LastName,Email,Password) VALUES (?,?,?,?,?)', [userId, FirstName, LastName, Email, myEncPassword], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" })
            }
            const users = {
                ID: userId,
                FirstName,
                LastName,
                Email,
                Password: myEncPassword
            }
            return res.status(201).json({ message: "User registered successfully", user: users })
        })
    })
    // return res.status(200).json({
    //     msg:"hi"
    // })
} catch (error) {
    console.log(error);
}
}