require("dotenv").config();
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const db = require("..//../config/database");
const jwtsecret = "jwt-secret-key"

exports.forgotPassword=(req,res)=>{
    try {
        const { Email } = req.body;
        db.query('SELECT * FROM users WHERE Email=?', [Email], (err, results) => {
            if (results.length == 0) {
                return res.status(400).json({ error: "unauthourized!!" })
            }
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
            }
            console.log(results);
            const userID = results[0].ID
            const secret = jwtsecret + results[0].Password
            console.log(secret);
            const token = jwt.sign({ id: userID }, secret, { expiresIn: "1d" })
            console.log(token);
            console.log(userID);
            const link = `http://localhost:4200/Reset-Password/${userID}/${token}`
            console.log("link",link);
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
        console.log("error......",error);
        return res.status(500).json({ error: "server error" });
    }
}