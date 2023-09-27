const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const bcrypt = require('bcrypt');
require("dotenv").config();
const db = require("./config/database");
const app = express();
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
    try {
        db.query('SELECT * FROM users', (err, results) => {
            if (err) {
                console.log(err);
            }
            res.json(results)
        })
    } catch (error) {
        console.log(error);
    }
});
app.post("/register", async (req, res) => {
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

    } catch (error) {
        console.log(error);
    }
})
app.post("/login", (req, res) => {
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
                return res.status(200).json({ message: "Login successful" })
            } else {
                return res.status(400).json({ message: "Invalid credentials" })
            }
        })
    } catch (error) {
        console.log(error);
    }
})

app.post("/checkmail",async(req,res)=>{
try {
    const {Email} = req.body;
    console.log(Email);
    db.query('SELECT * FROM users WHERE Email=? ', [Email], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
        console.log(results);
        const user = results[0];
        if(user){
            return res.status(200).json({ message: "User found" })
        }else if (results.length == 0) {
            return res.status(401).json({ error: "User not Found" })
        }
    })

} catch (error) {
    console.log("Some Error in checkmail")
    console.log(error);
}

})
app.post("/ResetPassword",async(req,res)=>{
    try {
        const {Email,Password} = req.body;
        // console.log("new password is : "+Password)
    const newPasswordHash = await bcrypt.hash(Password, 10);
    db.query('UPDATE users SET Password = ? WHERE Email = ?', [newPasswordHash, Email], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(200).json({ message: "Password updated successfully" });
    });
    } catch (error) {
        
    }
})
app.listen(4003, () => {
    console.log(`server is running on port 4003`);
})