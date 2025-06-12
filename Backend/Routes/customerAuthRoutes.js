import express from'express'
import { CheckAuth, login, logout, signup, verifyEmail } from '../controllers/cust.controllers.js'
import { protectedCustRoute } from '../middleware/Customer.middleware.js';

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/check",protectedCustRoute,CheckAuth)

router.post("/verifyemail",verifyEmail)

export default router
