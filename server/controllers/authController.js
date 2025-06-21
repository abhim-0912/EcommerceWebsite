const User = require('../models/User.js');
const generateToken = require('../utils/generateToken.js');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const newUser = await User.create({ name, email, password });

        const token = generateToken(newUser._id);

        return res.status(201).json({
            success: true,
            message: "User created successfully!",
            token,
            user: newUser
        });

    } catch (error) {
        console.error("Register Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const loginUser = async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({success: false, message: "Incorrect Password"});
        }
        const token = generateToken(user._id);
        return res.status(200).json({
            success: true,
            message: "Login Successfull",
            token,
            user
         });
    } catch(error) {
        console.error("Login Error:",error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
};

module.exports = { registerUser,loginUser };
