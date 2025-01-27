import sessionControllers from "../controllers/sessionControllers.js";
import verify from '../middleware/verify.js'
import { rateLimitSession } from "../middleware/rateLimiter.js";
import express from 'express';
const router = express.Router();
// router.use(verify);
router.use(rateLimitSession);
router.route("/add").post(sessionControllers.create_session);
router.route('/getById').get(sessionControllers.getById);
router.route("/getAllDay").get(sessionControllers.getDateDay);
router.route('/getInfoSession').get(sessionControllers.getAllSession);
router.route('/delete').delete(sessionControllers.delete_Session);
export default router;