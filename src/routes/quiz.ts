// quiz router
import { Router } from "express";
import {
  createQuiz,
  getQuiz,
  submitAnswer,
  getResults,
} from "../controllers/quizController";

const router = Router();

router.post("/create", createQuiz);
router.get("/:quiz_id", getQuiz);
router.post("/:quiz_id/submit", submitAnswer);
router.get("/:quiz_id/results/:user_id", getResults);

export default router;
