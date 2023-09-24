import { Router } from 'express'
import { getAllUsers } from '../controllers/userController'
import passport from "passport";

const router = Router()

// define your routes here
router.get('/users', 
passport.authenticate('jwt', { session: false }), (req, res) => {
    getAllUsers(req, res)
})
router.get('/test', (req:any, res:any) => {
    res.send("Hello!")
})

module.exports = router;
