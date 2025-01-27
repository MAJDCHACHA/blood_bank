import express from "express";
import personalControllers from "../controllers/personalControllers.js";
import { rateLimitUser } from "../middleware/rateLimiter.js";
import verify from '../middleware/verify.js'
const router =express.Router();
// router.use(verify);
router.use(rateLimitUser)
router.route('/add').post(personalControllers.create_personal)
router.route("/get").get(personalControllers.getAll);
router.route("/getById/:id").get(personalControllers.getById)
router.route('/getUnKnown').get(personalControllers.getAll_unknown);
router.route('/getDate').get(personalControllers.getDate);
router.route('/getDate_unKnow').get(personalControllers.getDate_unKnow);
router.route('/getSession/:date').get(personalControllers.getDate_date);
router.route('/edit').put(personalControllers.update_personal)
router.route('/editBlood').put(personalControllers.update_blood)
router.route('/delete').delete(personalControllers.delete_personal);
export default router;