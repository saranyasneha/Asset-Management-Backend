const express=require("express");
const router=express.Router();

const {addUser}=require("../controllers/user/addUser");

router.route("/addUser").post(addUser);

module.exports=router;
