import { Router } from "express";
import * as authController from "./controller.js";
import authUser from "./middleware.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.singnin);
router.get("/me", authUser, authController.userProfile);
router.post("/signout", authUser, authController.signOut);

router.post("/refresh-token");

export default router;
