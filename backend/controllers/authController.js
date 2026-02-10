const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-very-secure-secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });
};

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        const token = signToken(user._id);

        res.status(201).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

module.exports = { register, login };
