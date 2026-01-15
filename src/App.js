import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";



const API = process.env.REACT_APP_API;
const FINAL_STATUS = ["Pending", "Accepted", "Rejected"];
const ROUND_OPTIONS = ["Pending", "Selected", "Rejected"];
const ROUND_COUNTS = [1, 2, 3, 4, 5, 6, 7];

function App() {
  const [form, setForm] = useState({
    role: "",
    company: "",
    closingDate: ""
  });

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [deletedJob, setDeletedJob] = useState(null);

  /* ---------------- HELPERS ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${d}-${m}-${y}`;
  };

  const getDaysLeft = (date) =>
    Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

  const getRowClass = (status) => {
    if (status === "Accepted") return "status-accepted";
    if (status === "Rejected") return "status-rejected";
    if (status === "Expired") return "status-expired";
    return "status-pending";
  };

  /* ---------------- ADD JOB ---------------- */

  const addJob = () => {
    if (!form.role || !form.company || !form.closingDate)
      return alert("All fields required");

    const daysLeft = getDaysLeft(form.closingDate);

    const newJob = {
      role: form.role,
      company: form.company,
      closingDate: form.closingDate,
      status: daysLeft < 0 ? "Expired" : daysLeft <= 2 ? "Urgent" : "To Apply",
      selected: false,
      appliedDate: null,
      hasRounds: false,
      roundCount: 0,
      rounds: []
    };

    axios.post(`${API}/jobs`, newJob, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => {
      setJobs([...jobs, res.data]);   // MongoDB returns saved job
    });

    setForm({ role: "", company: "", closingDate: "" });
  };

  /* ---------------- DELETE + UNDO ---------------- */

  const deleteJob = (job) => {
    setDeletedJob(job);
    axios.delete(`${API}/jobs/${job._id || job.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setJobs(jobs.filter(j => (j._id || j.id) !== (job._id || job.id)));
  };

  const undoDelete = () => {
    if (deletedJob) {
      setJobs([...jobs, deletedJob]);
      setDeletedJob(null);
    }
  };

  /* ---------------- STORAGE ---------------- */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;   

    axios
      .get(`${API}/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setJobs(res.data);
      })
      .catch(err => {
        console.log("Jobs fetch failed:", err.response?.status);
      });
  }, []);


  /* ---------------- FILTERING ---------------- */

  const filtered = jobs.filter((j) =>
    `${j.role} ${j.company}`.toLowerCase().includes(search.toLowerCase())
  );

  const toApply = filtered.filter((j) =>
    ["To Apply", "Urgent", "Expired"].includes(j.status)
  );

  const applied = filtered.filter((j) =>
    FINAL_STATUS.includes(j.status)
  );

  const maxRounds = Math.max(
    0,
    ...applied.map(j => (j.hasRounds ? j.roundCount : 0))
  );

  /* ---------------- EXPORT CSV ---------------- */

  const exportCSV = () => {
    const header = ["Role", "Company", "Status", "Applied Date", "Closing Date"];
    const rows = jobs.map(j => [
      j.role,
      j.company,
      j.status,
      j.appliedDate || "",
      j.closingDate
    ]);

    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "job_tracker.csv";
    a.click();
  };
  const addToGoogleCalendar = (job) => {
    const deadline = new Date(job.closingDate);

    // Reminder one day before deadline
    const reminder = new Date(deadline);
    reminder.setDate(reminder.getDate() - 1);

    const format = (d) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const start = format(reminder);
    const end = format(deadline);

    const text = encodeURIComponent(`Apply for ${job.role} at ${job.company}`);
    const details = encodeURIComponent(
      `Role: ${job.role}\nCompany: ${job.company}\nDeadline: ${job.closingDate}`
    );

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}`;

    window.open(url, "_blank");
  };

  
  const stats = {
    total: jobs.length,
    toApply: jobs.filter(j => ["To Apply", "Urgent"].includes(j.status)).length,
    expired: jobs.filter(j => j.status === "Expired").length,
    applied: jobs.filter(j => j.appliedDate).length,
    accepted: jobs.filter(j => j.status === "Accepted").length,
    rejected: jobs.filter(j => j.status === "Rejected").length,
    pending: jobs.filter(j => j.status === "Pending").length
  };

  return (
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          localStorage.getItem("token") ? (
            <div className="container">
      <h1>Job Application Tracker</h1>
      <button
          onClick={logout}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "6px 12px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      <div className="stats-panel">
      <div><strong>Total</strong><br />{stats.total}</div>
      <div><strong>To Apply</strong><br />{stats.toApply}</div>
      <div><strong>Applied</strong><br />{stats.applied}</div>
      <div><strong>Pending</strong><br />{stats.pending}</div>
      <div><strong>Accepted</strong><br />{stats.accepted}</div>
      <div><strong>Rejected</strong><br />{stats.rejected}</div>
      <div><strong>Expired</strong><br />{stats.expired}</div>
    </div>

      <input
        placeholder="Find job..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="form">
        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <input
          type="date"
          value={form.closingDate}
          onChange={(e) =>
            setForm({ ...form, closingDate: e.target.value })
          }
        />
        <button onClick={addJob}>Add Job</button>
        <button onClick={exportCSV}>Export CSV</button>
      </div>

      {deletedJob && (
        <button onClick={undoDelete}>Undo Delete</button>
      )}

      {/* ---------------- APPLICATIONS TO APPLY ---------------- */}
      <h2>Applications To Apply</h2>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Role</th>
            <th>Company</th>
            <th>Last Date</th>
            <th>Days Left</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {toApply.map(job => (
            <tr key={job._id || job.id} className={getRowClass(job.status)}>
              <td>
                {job.status !== "Expired" && (
                  <input
                    type="checkbox"
                    checked={job.selected}
                    onChange={() =>
                      setJobs(jobs.map(j =>
                        (j._id || j.id) === (job._id || job.id)
                            ? { ...j, selected: !j.selected }
                            : j
                      ))
                    }
                  />
                )}
              </td>
              <td>{job.role}</td>
              <td>{job.company}</td>
              <td>{formatDate(job.closingDate)}</td>
              <td>{getDaysLeft(job.closingDate) < 0 ? "—" : getDaysLeft(job.closingDate)}</td>
              <td>{job.status}</td>
              <td>
                <button onClick={() => deleteJob(job)}>Delete</button>
                <button
                  style={{ marginLeft: "8px" }}
                  onClick={() => addToGoogleCalendar(job)}
                >
                  📅
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        style={{ marginTop: 20 }}
        onClick={() => {
          const today = new Date().toISOString().split("T")[0];
          setJobs(jobs.map(j =>
            j.selected === true
              ? { ...j, status: "Pending", appliedDate: today, selected: false }
              : j
          ));
        }}
      >
        Mark selected jobs applied
      </button>

      {/* ---------------- APPLIED APPLICATIONS ---------------- */}
      <h2>Applied Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Has Rounds?</th>
            <th>Rounds</th>
            {Array.from({ length: maxRounds }).map((_, i) => (
              <th key={i}>R{i + 1}</th>
            ))}
            <th>Role</th>
            <th>Company</th>
            <th>Applied On</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applied.map(job => (
            <tr key={job._id || job.id} className={getRowClass(job.status)}>
              <td>
                {!job.hasRounds ? (
                  <select
                    value={job.status}
                    onChange={(e) =>
                      setJobs(jobs.map(j =>
                        (j._id || j.id) === (job._id || job.id) ? { ...j, status: e.target.value } : j
                      ))
                    }
                  >
                    {FINAL_STATUS.map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                ) : job.status}
              </td>

              <td>
                <select
                  value={job.hasRounds ? "Yes" : "No"}
                  onChange={(e) =>
                    setJobs(jobs.map(j =>
                      (j._id || j.id) === (job._id || job.id)
                        ? { ...j, hasRounds: e.target.value === "Yes", roundCount: 0, rounds: [], status: "Pending" }
                        : j
                    ))
                  }
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </td>

              <td>
                {job.hasRounds && (
                  <select
                    value={job.roundCount || ""}
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      setJobs(jobs.map(j =>
                        (j._id || j.id) === (job._id || job.id)
                          ? { ...j, roundCount: count, rounds: Array(count).fill("Pending"), status: "Pending" }
                          : j
                      ));
                    }}
                  >
                    <option value="">Select</option>
                    {ROUND_COUNTS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}
              </td>

              {Array.from({ length: maxRounds }).map((_, idx) => (
                <td key={idx}>
                  {job.hasRounds && idx < job.roundCount && (
                    <select
                      value={job.rounds[idx]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setJobs(jobs.map(j => {
                          if ((j._id || j.id) !== (job._id || job.id)) return j;

                          const rounds = [...j.rounds];
                          rounds[idx] = value;

                          if (value === "Rejected") {
                            for (let i = idx + 1; i < rounds.length; i++) rounds[i] = "Rejected";
                          }

                          const status =
                            rounds.every(r => r === "Selected")
                              ? "Accepted"
                              : rounds.some(r => r === "Rejected")
                              ? "Rejected"
                              : "Pending";

                          return { ...j, rounds, status };
                        }));
                      }}
                    >
                      {ROUND_OPTIONS.map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  )}
                </td>
              ))}

              <td>{job.role}</td>
              <td>{job.company}</td>
              <td>{formatDate(job.appliedDate)}</td>
              <td>
                <button onClick={() => deleteJob(job)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    ) : (
      <Navigate to="/login" />
    )
  }
  />
  </Routes>
);
}


export default App;
