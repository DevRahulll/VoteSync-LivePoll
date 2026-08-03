import { Router } from "express";
import * as pollController from "./controller.js";
import authUser from "../auth/middleware.js";

const router = Router();

router.post("/", authUser, pollController.createPoll);
router.patch("/:pollId", authUser, pollController.updatePoll);
router.delete("/:pollId", authUser, pollController.deletePoll);

router.get("/mypoll", authUser);
router.get("/mypoll/:pollId", authUser);

router.post("/:pollId/question", authUser, pollController.createQuestion);
router.patch("/:pollId/question/:questionId", authUser);
router.delete("/:pollId/question/:questionId", authUser);
router.patch("/:pollId/question/order", authUser);

router.patch("/:pollId/:questionId/:optionId", authUser);

export default router;
