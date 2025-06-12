
import express from'express'
import { CheckAuth, login, logout, resetPasswordRequest, signup, verifyEmail } from '../controllers/admin.controllers.js'
import { protectedAdminRoute } from '../middleware/admin.middleware.js'

const router = express.Router()
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/check",protectedAdminRoute,CheckAuth)
router.post("/verifyemail",verifyEmail)
router.post("/resetpassword",resetPasswordRequest)
router.post("/changepassword",protectedAdminRoute,resetPasswordRequest)

export default router;

