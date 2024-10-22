// src/controllers/quizController.ts
import { Request, Response } from 'express';
import { quizzes, results } from '../models/quiz';
import { v4 as uuidv4 } from 'uuid';
import { Quiz, Answer, Result } from '../types/quiz';

// Create a new quiz
export const createQuiz = (req: Request, res: Response) => {
  const { title, questions } = req.body;

  const quiz: Quiz = {
    id: uuidv4(),
    title,
    questions: questions.map((q: any) => ({
      id: uuidv4(),
      text: q.text,
      options: q.options,
      correct_option: q.correct_option,
    })),
  };

  quizzes.push(quiz);
  res.status(201).json(quiz);
};

// Get a quiz by ID without revealing correct answers
export const getQuiz = (req: Request, res: Response) => {
  const quiz = quizzes.find(q => q.id === req.params.quiz_id);

  if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return; 
  }

  const quizWithoutAnswers = {
    ...quiz,
    questions: quiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      options: q.options,
    })),
  };

  res.status(200).json(quizWithoutAnswers);
};

// Submit an answer and get feedback
export const submitAnswer = (req: Request, res: Response) => {
  const { question_id, selected_option, user_id } = req.body;
  const quiz = quizzes.find(q => q.id === req.params.quiz_id);
  
  if (!user_id) {
    res.status(400).json({ error: "user_id is required." });
    return; 
  }

  if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
  }

  const question = quiz.questions.find(q => q.id === question_id);

  if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return; 
  }

  // Store the result in memory
    let userResult = results.find(r => r.quiz_id === quiz.id && r.user_id === user_id);
    
    if (userResult) {
        // Check if the answer for the question is already submitted
        const existingAnswer = userResult.answers.find(a => a.question_id === question_id);
        
        if (existingAnswer) {
          res.status(400).json({
            message: "Answer already submitted for this question",
            existingAnswer,
          });
          return;
        }
    }
    
    const is_correct = question.correct_option === selected_option;

  const answer: Answer = {
    question_id,
    selected_option,
    is_correct,
  };

  if (userResult) {
    userResult.answers.push(answer);
    userResult.score += is_correct ? 1 : 0;
  } else {
    userResult = {
      quiz_id: quiz.id,
      user_id,
      score: is_correct ? 1 : 0,
      answers: [answer],
    };
    results.push(userResult);
  }

  res.json({
    is_correct,
    correct_option: is_correct ? undefined : question.correct_option,
  });
};

// Get results for a specific quiz
export const getResults = (req: Request, res: Response) => {
  const { quiz_id, user_id } = req.params;
  
  const result = results.find(r => r.quiz_id === quiz_id && r.user_id === user_id);

  if (!result) {
      res.status(404).json({ message: 'Result not found' });
      return;
  }

  res.json(result);
};
