import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const priorities = ["Low", "Medium", "High"];
const API_URL = "http://localhost:5000/tasks";

function TaskListPage({ filter = "all" }) {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");
  const [toastVisible, setToastVisible] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  // Toggle Completed
  async function toggleCompleted(task) {
  try {
    // Optimistically update UI
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t._id === task._id ? { ...t, completed: !t.completed } : t
      )
    );

    // Send update to backend
    await axios.put(`${API_URL}/${task._id}`, {
      ...task,
      completed: !task.completed,
    });
  } catch (err) {
    console.error("Failed to update completed:", err);
    // Optionally revert UI change if backend fails
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t._id === task._id ? { ...t, completed: task.completed } : t
      )
    );
  }
}


  // Mark all as completed
  async function markAllCompleted() {
    try {
      await Promise.all(
        tasks
          .filter(t => !t.completed)
          .map(t => axios.put(`${API_URL}/${t._id}`, { ...t, completed: true }))
      );
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to mark all tasks as completed");
    }
  }

  function showDeleteToast(id) {
    setToDeleteId(id);
    setToastVisible(true);
  }

  async function confirmDelete() {
    try {
      await axios.delete(`${API_URL}/${toDeleteId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
    setToastVisible(false);
    setToDeleteId(null);
  }

  function cancelDelete() {
    setToastVisible(false);
    setToDeleteId(null);
  }

  // Filter tasks
  const filteredTasks = tasks
    .filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      if (filter === "due-today") {
        if (!task.dueDate) return false;
        const today = new Date().toISOString().split('T')[0];
        return task.dueDate === today;
      }
      return true;
    })
    .filter(task => (task.title || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(task => filterPriority === "All" || task.priority === filterPriority)
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        return priorities.indexOf(b.priority) - priorities.indexOf(a.priority);
      }
      return 0;
    });

  return (
    <div className="app-container">
      <h1>
        {filter === "completed" ? "Completed Tasks" : filter === "pending" ? "Pending Tasks" : filter === "due-today" ? "Tasks Due Today" : "All Tasks"}
      </h1>

      {successMessage && <div className="success-toast">{successMessage}</div>}

      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="All">All Priorities</option>
          {priorities.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>

        <button onClick={markAllCompleted} style={{ marginLeft: 'auto' }}>
          Mark All Completed
        </button>

        <Link to="/add" className="button-link">
          + Add New Task
        </Link>
      </div>

      {filteredTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>No tasks available.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Done</th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task._id} className={task.completed ? "task-completed" : ""}>
                <td>
                  <input
                    type="checkbox"
                    checked={task.completed || false} // bind to completed field
                    onChange={async (e) => {
                    try {
                      await axios.put(`${API_URL}/${task._id}`, {
                      ...task,
                      completed: e.target.checked,  // update backend
                      });
                      fetchTasks(); // refresh the list
                    } catch (err) {
                    console.error("Error updating completion:", err);
                    }
           }}
  />
</td>
                <td>{task.title}</td>
                <td>{task.description || "—"}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</td>
                <td className={`priority-${task.priority}`}>{task.priority}</td>
                <td className="actions">
                  <Link to={`/edit/${task._id}`} className="button-link icon-btn">✏</Link>
                  <button onClick={() => showDeleteToast(task._id)} className="button-link icon-btn" style={{ background: '#d9534f' }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {toastVisible && (
        <div className="toast-overlay">
          <div className="toast">
            <div>Delete this task?</div>
            <div className="toast-actions">
              <button onClick={confirmDelete} data-type="confirm">Yes</button>
              <button onClick={cancelDelete} data-type="cancel">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskListPage;
