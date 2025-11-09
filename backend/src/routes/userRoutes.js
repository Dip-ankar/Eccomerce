import express from "express";
import { deleteUser, forgotPassword, getSingleUser, getUserDetails, getUserList, loginUser, logoutUser, registerUser, resetPassword, updatePassword, updateProfile, updateUserRole, uploadMiddleware } from "../controller/userController.js";
import { isAuthenticatedUser, roleBasedAccess } from "../middleware/authMiddleware.js";



const router = express.Router();

router.route("/register").post(uploadMiddleware,registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser);

router.get("/me",isAuthenticatedUser,getUserDetails);

router.post("/password/forgot", forgotPassword);

router.put("/password/reset/:token", resetPassword);

router.put("/password/update", isAuthenticatedUser, updatePassword);

router.put("/profile/update",isAuthenticatedUser,uploadMiddleware,updateProfile)

router.get("/admin/getUser",isAuthenticatedUser,roleBasedAccess("admin"),getUserList);


router.route("/admin/getUser/:id").get(isAuthenticatedUser,roleBasedAccess("admin"),getSingleUser)
.put(isAuthenticatedUser,roleBasedAccess("admin"),updateUserRole)
.delete(isAuthenticatedUser,roleBasedAccess("admin"),deleteUser);

export default router;