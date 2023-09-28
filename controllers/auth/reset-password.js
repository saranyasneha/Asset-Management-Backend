const bcrypt = require('bcrypt');
require("dotenv").config();
const db = require("..//../config/database");

exports.resetPassword=async(req,res)=>{
    try {
        const {userID,Password}=req.body;
        console.log("userid..........",userID);
        const newPasswordHash = await bcrypt.hash(Password, 10);
        db.query('UPDATE users SET Password = ? WHERE ID = ?', [newPasswordHash, userID], (err,results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
            }
            // const secret = jwtsecret + results[0].Password;
            //     try {
            //         const verify = jwt.verify(token, secret);
            //         res.send("verified")
            //     } catch (error) {
            //         res.send("not verified")
            //     }
            return res.status(200).json({ message: "Password updated successfully" });
        });
        // db.query('SELECT * FROM users WHERE ID=?', [userID], async (err, results) => {
        //     if (results.length == 0) {
        //         return res.status(401).json({ error: 'user not exist' })
        //     }
        //     console.log(userID);
        //     const secret = jwtsecret + results[0].Password;
        //     try {
        //         const verify = jwt.verify(token, secret);
        //         res.send("verified")
        //     } catch (error) {
        //         res.send("not verified")
        //     }
        // })
        // return res.status(200).json({message:"reset"}) 
    } catch (error) {
        console.log(error);
    }
}