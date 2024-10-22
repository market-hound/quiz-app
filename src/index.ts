// Create express server
import express from "express";
import quizRoutes from "./routes/quiz";

export const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3005;

app.use("/api/quiz", quizRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
