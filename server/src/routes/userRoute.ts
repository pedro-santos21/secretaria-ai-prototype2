import { Router } from 'express'
import { getAllUsers } from '../controllers/userController'
import passport from "passport";
import { checkIfPrivilegedRole } from '../lib/authUtils';

const router = Router()

// Routes
router.get('/users', 
passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const user = req.user;
    checkIfPrivilegedRole(user)
    getAllUsers(req, res)
})
router.get('/test', (req:any, res:any) => {
    res.send("Hello!")
})

module.exports = router;
