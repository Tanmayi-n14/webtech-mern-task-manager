import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom'; 

const priorities = ["Low", "Medium", "High"];
const API_URL = "http://localhost:5000/tasks";

function TaskFormPage({ isEditMode = false }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Gets the :id from the URL

  // ----- NEW LINE -----
  // Get today's date in YYYY-MM-DD format for the input's min attribute
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isEditMode && id) {
      axios.get(`${API_URL}/${id}`)
        .then(res => {
          // Format date for <input type="date">
          const formattedDate = res.data.dueDate 
            ? new Date(res.data.dueDate).toISOString().split('T')[0] 
            : "";
          setForm({ ...res.data, dueDate: formattedDate });
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load task.");
        });
    }
  }, [isEditMode, id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return alert("Task title is required.");

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, form);
        // On success, navigate to home and pass a "success" message
        navigate('/', { state: { message: 'Task updated successfully!' } });
      } else {
        await axios.post(API_URL, form);
        navigate('/', { state: { message: 'Task added successfully!' } });
      }
    } catch (err) {
      console.error("Error saving task:", err);
      setError("Failed to save task. Please try again.");
    }
  }

  return (
    <div className="app-container">
      <h1>{isEditMode ? "Edit Task" : "Add New Task"}</h1>
      
      {error && <p className="auth-error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group form-group-full">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            min={today} // ----- THIS IS THE CHANGE -----
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
            {priorities.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit">{isEditMode ? "Update Task" : "Add Task"}</button>
          <Link to="/" className="button-link secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default TaskFormPage;