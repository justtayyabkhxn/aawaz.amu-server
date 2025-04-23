"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required.' });
            return;
        }
        const existing = await User_1.User.findOne({ email });
        if (existing) {
            res.status(400).json({ error: 'Email already in use.' });
            return;
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.User({ email, password: hashed });
        await user.save();
        res.status(201).json({ message: 'User created successfully.' });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email },
        });
    }
    catch (err) {
        console.error('Signin error:', err);
        return res.status(500).json({ error: 'Server error.' });
    }
};
exports.signin = signin;
