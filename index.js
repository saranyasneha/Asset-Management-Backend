const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer')
const uuid = require("uuid");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
require("dotenv").config();
const db = require("./config/database");
const app = express();
app.use(express.json());
app.use(cors())
const jwtsecret = "jwt-secret-key"
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
                return res.status(200).json({ message: "Login successful!!!!" })
            } else {
                return res.status(200).json({ message: "Invalid credentials" })
            }
        })
    } catch (error) {
        console.log(error);
    }
})

app.post("/forgot-password", async (req, res) => {
    try {
        const { Email } = req.body;
        db.query('SELECT * FROM users WHERE Email=?', [Email], (err, results) => {
            if (results.length == 0) {
                return res.status(400).json({ error: "unauthourized!!" })
            }
            console.log(results);
            const userID = results[0].ID
            const secret = jwtsecret + results[0].Password
            console.log(secret);
            const token = jwt.sign({ id: userID }, secret, { expiresIn: "1d" })
            console.log(token);
            console.log(userID);
            const link = `http://localhost:4000/reset-password/${userID}/${token}`
            const mailOptions = {
                from: "saranshan284@gmail.com",
                to: Email,
                subject: "Reset password link",
                html: `<!DOCTYPE html>
            <html lang="en" >
            <head>
              <meta charset="UTF-8">
              <title>Reset Password</title>
            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2;">
              <div style="margin:20px auto;width:70%;padding:20px;border:2px solid #eee;">
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Entrans Hub</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>We have sent you this mail in response to your request to reset your password on Entrans Hub</p>
                <p>To reset your password, please follow the link below:</P>
                <a href="${link}" style="text-decoration: none;cursor:pointer;">
                <button style="background: #00466a; color: #fff; border: none; padding: 10px 20px; font-size: 1em; border-radius: 4px; cursor: pointer;">Reset Password</button>
                </a>
                <p style="font-size:0.9em;">Regards,<br />Entrans hub</p>
                <hr style="border:none;border-top:1px solid #eee" />
               
              </div>
            </div></body>
            </html>
            `,
                // text:link
            }
            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 465,
                secure: true,
                auth: {
                    user: "saranshan284@gmail.com",
                    pass: "yurh ckol qksz prlc"
                }
            })
            transporter.sendMail(
                mailOptions, (error, info) => {
                    if (error) {
                        console.log("email error", error);
                        res.status(500).json({ error: "Failed to send password" })
                    } else {
                        console.log("Email sent", info);
                        res.status(200).json({ message: "Reset link sent to your mail successfully!!", data: results })
                    }
                }
            )
            // return res.status(400).json({ error: "already existed!!" })

            //  return res.status(400).json({error:"user"})
        })
    } catch (error) {
        console.log("error......");
        res.status(500).json({ error: "Failed to reset password" });
    }
})
app.get("/reset-password/:userID/:token", (req, res) => {
    try {
        const { userID, token } = req.params;
        db.query('SELECT * FROM users WHERE ID=?', [userID], async (err, results) => {
            if (results.length == 0) {
                return res.status(401).json({ error: 'user not exist' })
            }
            console.log(userID);
            const secret = jwtsecret + results[0].Password;
            try {
                const verify = jwt.verify(token, secret);
                res.send("verified")
            } catch (error) {
                res.send("not verified")
            }
        })
        // return res.status(200).json({message:"reset"}) 
    } catch (error) {
        console.log(error);
    }
})
app.listen(4000, () => {
    console.log(`server is running on port 4000`);
})