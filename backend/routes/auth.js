const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({
            token,
            role: admin.role,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create first admin route
router.post('/create-first-admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if any admin exists
        const adminExists = await Admin.findOne();
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create first admin
        const admin = new Admin({
            username,
            password,
            role: 'super_admin'
        });

        await admin.save();
        res.status(201).json({ message: 'Super admin created successfully' });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;