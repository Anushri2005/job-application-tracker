const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  role: String,
  company: String,
  closingDate: String,
  status: String,
  selected: Boolean,
  appliedDate: String,
  hasRounds: Boolean,
  roundCount: Number,
  rounds: [String]
});

module.exports = mongoose.model("Job", jobSchema);
