import User from '../models/User';
import crypto from 'crypto';


export const login = async (req:any, res:any) => {
    try {
        const {  email, password } = req.body;

        res.status(201).json();
    } catch (error) {
        console.error("❌ Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
};


export const getAllUsers = async (req:any, res:any) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};