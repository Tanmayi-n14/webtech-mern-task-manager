import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:5000/tasks";

function TaskPageTemplate({ filterFn, title }) {
  const [tasks, setTasks] = useState([]);

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

  async function toggleCompleted(task) {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, completed: !t.completed } : t
        )
      );
      await axios.put(`${API_URL}/${task._id}`, {
        ...task,
        completed: !task.completed,
      });
    } catch (err) {
      console.error("Failed to update task:", err);
      // revert
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, completed: task.completed } : t
        )
      );
    }
  }

  const filteredTasks = tasks.filter(filterFn);

  return (
    <div className="app-container">
      <h1>{title}</h1>
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
            {filteredTasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={!!task.completed}
                    onChange={() => toggleCompleted(task)}
                  />
                </td>
                <td>{task.title}</td>
                <td>{task.description || "—"}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</td>
                <td className={`priority-${task.priority}`}>{task.priority}</td>
                <td>
                  <Link to={`/edit/${task._id}`} className="button-link icon-btn">✏</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TaskPageTemplate;
