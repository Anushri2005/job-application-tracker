const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");


require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

/* ---------------- Job Schema ---------------- */
const JobSchema = new mongoose.Schema({
  role: String,
  company: String,
  closingDate: String,
  status: String,
  appliedDate: String,
  hasRounds: Boolean,
  roundCount: Number,
  rounds: [String],
  userId: String   // for login later
});

const Job = mongoose.model("Job", JobSchema);

/* ---------------- API ROUTES ---------------- */

// Health check
app.get("/", (req, res) => {
  res.send("Job Tracker API Running");
});

// Get all jobs
app.get("/api/jobs", auth, async (req, res) => {
  const jobs = await Job.find({ userId: req.userId });
  res.json(jobs);
});

// Add job
app.post("/api/jobs", auth, async (req, res) => {
  const job = new Job({
    ...req.body,
    userId: req.userId
  });
  await job.save();
  res.json(job);
});

// Delete job
app.delete("/api/jobs/:id", auth, async (req, res) => {
  await Job.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId
  });
  res.json({ success: true });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
