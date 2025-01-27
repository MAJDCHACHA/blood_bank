import express from "express";
import authControllers from "../controllers/authControllers.js";
import verify from '../middleware/verify.js';
import {rateLimitLogin} from "../middleware/rateLimiter.js";
const router=express.Router();
router.use(rateLimitLogin)
// admin
router.route('/admin/login').post(authControllers.login_admin);
router.route('/admin/refresh').get(authControllers.refresh_admin);
router.route('/admin/logout').post(authControllers.logout_admin);
// user
router.route("/user/login").post(authControllers.login_user);
router.route("/user/refresh").get(authControllers.refresh_user);
router.route("/user/logout").post(authControllers.logout_user);
// router.use(verify);
router.route("/admin/CreateUser").post(authControllers.upload.single('image'),authControllers.register_user);
router.route("/admin/getUser").get(authControllers.get_user);
router.route("/admin/getBlocked").get(authControllers.get_user_blocked);
router.route('/admin/edit').put(authControllers.edit_user);
router.route("/admin/deleteUser").delete(authControllers.delete_user);
export default router;