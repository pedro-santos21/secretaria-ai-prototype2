import type {Request, Response} from 'express';
const userModel = require('../models/User');

// GET all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userModel.find()
        res.status(200).json(users)
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getAllUsers
};
