const express=require('express');
const router=express.Router();

const {login}=require("../controllers/auth/login");
const {resetPassword}=require("../controllers/auth/reset-password")
const {forgotPassword}=require("../controllers/auth/forgot-password")

router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports=router;