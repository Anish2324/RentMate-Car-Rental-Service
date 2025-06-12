import express from'express'
import { getFeedbacksByCar, giveFeedback } from '../controllers/feedback.controllers.js';
import { protectedCustRoute } from '../middleware/Customer.middleware.js';

const router = express.Router()
// routes/feedbackRoutes.js
router.post("/:Reg_No", protectedCustRoute, giveFeedback);
router.get("/:Reg_No", getFeedbacksByCar);



export default router;

