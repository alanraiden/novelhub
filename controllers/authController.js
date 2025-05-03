const jwt = require("jsonwebtoken");
const User = require('../models/User');
const secret_key = process.env.jwt_secret;

const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send("Bad request...");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                msg: "Email already exists..."
            });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: "user",
            userimage: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167'
        });

        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json(userResponse);
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: "Email doesn't exist..."
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Incorrect password..."
            });
        }

        const token = jwt.sign({ userId: user._id }, secret_key, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(200).json({
            msg: "Login successful...",
            token,
            userId: user._id
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

const logoutUser = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    
    return res.status(200).json({
        msg: "Logout successful..."
    });
};

module.exports = {
    signupUser,
    loginUser,
    logoutUser
};