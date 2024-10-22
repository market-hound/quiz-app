import request from "supertest";
import server, { app } from "../index";

describe("Quiz API", () => {
  let createdQuizId: string;
  let firstQuestionId: string;

  // Close the server after all tests are done
  afterAll(() => {
    server.close();
  });

  // Test the Create Quiz endpoint
  it("should create a new quiz", async () => {
    const response = await request(app)
      .post("/api/quiz/create")
      .send({
        title: "Test Quiz",
        questions: [
          {
            text: "What is 2 + 2?",
            options: ["1", "2", "3", "4"],
            correct_option: 4,
          },
          {
            text: "Which country won Chess Olympiad 2024?",
            options: ["USA", "India", "China", "Kazakhstan"],
            correct_option: 2,
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Test Quiz");
    expect(response.body.questions.length).toBe(2);

    // Save the quiz ID and first question ID for later use in other tests
    createdQuizId = response.body.id;
    firstQuestionId = response.body.questions[0].id;
  });

  // Test Get Quiz endpoint
  it("should fetch a quiz without revealing correct answers", async () => {
    const response = await request(app).get(`/api/quiz/${createdQuizId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Test Quiz");
    response.body.questions.forEach((question: any) => {
      expect(question).not.toHaveProperty("correct_option");
    });
  });

  // Test Submit Answer endpoint
  it("should submit an answer and return correct feedback", async () => {
    const response = await request(app)
      .post(`/api/quiz/${createdQuizId}/submit`)
      .send({
        question_id: firstQuestionId, // Use first question
        selected_option: 4,
        user_id: "user",
      });

    expect(response.status).toBe(200);
    expect(response.body.is_correct).toBe(true);
  });

  // Test answer submission prevention (can't submit the same question twice)
  it("should return error when submitting an answer for the same question twice", async () => {
    // First submission (already submitted in previous test)
    const response = await request(app)
      .post(`/api/quiz/${createdQuizId}/submit`)
      .send({
        question_id: firstQuestionId,
        selected_option: 4,
        user_id: "user",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Answer already submitted for this question"
    );
  });

  // Test Get Results endpoint
  it("should fetch quiz results for a specific user", async () => {
    const response = await request(app).get(
      `/api/quiz/${createdQuizId}/results/user`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("quiz_id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body.answers.length).toBe(1);
    expect(response.body.answers[0].is_correct).toBe(true);
  });
});
