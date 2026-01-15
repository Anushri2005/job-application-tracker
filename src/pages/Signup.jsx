import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../auth.css";

const API = process.env.REACT_APP_API;

export default function Signup() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/signup`, form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">Job Application Tracker</h1>

      <div className="auth">
        <h2>Signup</h2>

        <form onSubmit={submit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit">Signup</button>
        </form>

        <p>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#6b63ff", fontWeight: 600 }}>
            Login
          </a>
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
