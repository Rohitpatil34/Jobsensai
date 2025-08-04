import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/Connection.js";
import UserRouter from "./Routes/User.js";
import AIInterview from "./Routes/interviewRoutes.js";
import AnalyzeResume from "./Routes/ResumeAnalyze.js";
import { authenticateToken } from "./Middlewares/Auth.js";
import { generateAIResponse } from "./Controller/Aiagent.js";
import { FetchInternships } from "./Controller/InternshipController.js";
import { fetchjob } from "./Controller/indid.js";
import { fetchJobsFromAdzuna } from "./Controller/job.js";
import { getPlaylist, searchYouTube } from "./Controller/youtube.js";
import { getJobsByTitle } from "./Controller/getJobsByTitle.js";
import { scrapeCourseraCourses } from "./Controller/course.js";
dotenv.config();

const PORT = process.env.PORT || 8000;
const URI = process.env.MONGODB_URI;
const app = express();
connectDB(URI);

//Middlerwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check Route
app.get("/health", (req, res) => {
  res.send("OK");
});

// Routes
app.use("/api/user", UserRouter);
app.post("/api/aiagent", authenticateToken, generateAIResponse);
app.use("/api/aiinterview", AIInterview);
app.use("/api/resume", AnalyzeResume);
app.get("/api/jobs", FetchInternships);
app.get("/api/job", fetchjob);
app.get("/api/jobb", fetchJobsFromAdzuna);
app.get("/api/youtube", searchYouTube);
app.get("/api/youtube/playlist/:id", getPlaylist);
app.get("/api/jobbb", getJobsByTitle);
app.get("/api/course", scrapeCourseraCourses);



// checkAndSendEmails()
app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
