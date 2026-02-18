"use client"; // <--- This is required for Next.js components that use State
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from "next-auth/react";
import './globals.css';

export default function Home() {
  const { data: session, status } = useSession();

  // --- LOGIN STATE (Local state for form inputs only) ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // --- APP STATE ---
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalCollected: 0, totalPending: 0, alerts: 0 });
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Nursery");
  const [fees, setFees] = useState("");

  // IN NEXT.JS, WE USE RELATIVE PATHS
  const API_URL = "/api/students";

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); // Clear previous errors

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (result?.error) {
        setLoginError("Invalid Username or Password");
      }
      // If success, the useSession hook will update status to "authenticated" automatically
    } catch (error) {
      setLoginError("Login failed");
    }
  };

  const fetchData = () => {
    axios.get(API_URL)
      .then(response => {
        setStudents(response.data);
        calculateStats(response.data);
      })
      .catch(err => console.log(err));
  };

  const calculateStats = (data) => {
    let collected = 0;
    let pending = 0;
    let alertCount = 0;
    data.forEach(student => {
      collected += student.paidAmount;
      pending += (student.totalFees - student.paidAmount);
      if (student.consecutiveAbsences >= 2) alertCount++;
    });
    setStats({ totalStudents: data.length, totalCollected: collected, totalPending: pending, alerts: alertCount });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_URL, {
      name: name, grade: grade, totalFees: Number(fees),
      paidAmount: 0, paymentStatus: "Pending", consecutiveAbsences: 0
    })
      .then(res => { fetchData(); setName(""); setFees(""); })
      .catch(err => console.log(err));
  };

  const handlePay = (id, currentName) => {
    const amount = window.prompt(`How much is ${currentName} paying now?`);
    if (amount) {
      axios.put(`${API_URL}/${id}`, { action: 'payment', amount: amount })
        .then(res => fetchData())
        .catch(err => console.log(err));
    }
  };

  const markAttendance = (id, status) => {
    axios.put(`${API_URL}/${id}`, { action: 'attendance', status: status })
      .then(res => fetchData())
      .catch(err => console.log(err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete permanently?")) {
      axios.delete(`${API_URL}/${id}`)
        .then(res => fetchData())
        .catch(err => console.log(err));
    }
  };

  if (status === "loading") {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>🔐 Kindergarten Login</h1>
        <div className="form-box" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" style={{ width: '90%', marginBottom: '10px' }} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <input type="password" placeholder="Password" style={{ width: '90%', marginBottom: '10px' }} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button type="submit" style={{ width: '100%' }}>Login</button>
          </form>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🎓 Kindergarten Manager Pro (Next.js)</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Welcome, {session.user.name}</span>
          <button onClick={() => signOut()} style={{ backgroundColor: '#777' }}>Logout</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card card-blue"><h3>Total Students</h3><p>{stats.totalStudents}</p></div>
        <div className="card card-green"><h3>Cash Collected</h3><p>${stats.totalCollected}</p></div>
        <div className="card card-red"><h3>Unpaid Debts</h3><p>${stats.totalPending}</p></div>
        <div className="card card-orange"><h3>Attendance Alerts</h3><p>{stats.alerts}</p></div>
      </div>

      <div className="form-box">
        <h3>Register New Student</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Student Name" onChange={(e) => setName(e.target.value)} value={name} required />
          <select onChange={(e) => setGrade(e.target.value)} value={grade} className="grade-select">
            <option value="Nursery">Nursery</option>
            <option value="Pre-KG">Pre-KG</option>
            <option value="KG">KG</option>
            <option value="Preparatory">Preparatory</option>
          </select>
          <input type="number" placeholder="Total Fees ($)" onChange={(e) => setFees(e.target.value)} value={fees} required />
          <button type="submit">Add Student</button>
        </form>
      </div>

      <div className="list-box">
        <h3>Student Records</h3>
        <table>
          <thead>
            <tr><th>Student Info</th><th>Financial Status</th><th>Attendance & Actions</th></tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td><div style={{ fontWeight: 'bold' }}>{student.name}</div><div className="badge">{student.grade}</div></td>
                <td>
                  <div>Total: ${student.totalFees} | <span style={{ color: 'red' }}> Rem: ${student.totalFees - student.paidAmount}</span></div>
                  {student.paymentStatus !== "Paid" ? (
                    <button className="pay-btn" onClick={() => handlePay(student._id, student.name)}>💳 Receive Payment</button>
                  ) : (<span className="status-paid">✅ Fully Paid</span>)}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div>{student.consecutiveAbsences >= 2 ? (<span className="alert-badge">⚠️ CALL PARENT</span>) : (<span style={{ color: 'green', fontSize: '12px' }}>Attendance OK</span>)}</div>
                    <div>
                      <button className="icon-btn" onClick={() => markAttendance(student._id, 'present')}>✅</button>
                      <button className="icon-btn" onClick={() => markAttendance(student._id, 'absent')}>❌</button>
                      <button className="icon-btn" style={{ color: 'red', border: '1px solid red' }} onClick={() => handleDelete(student._id)}>🗑️</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}