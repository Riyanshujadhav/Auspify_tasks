const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for initial demonstration
let tasks = [
  { id: 1, title: 'Build Full-Stack Architecture', priority: 'High', status: 'Completed', timestamp: '10:30 AM' },
  { id: 2, title: 'Implement Express REST API Endpoints', priority: 'Critical', status: 'In Progress', timestamp: '11:15 AM' },
  { id: 3, title: 'Connect Client-Side Fetch Handlers', priority: 'Medium', status: 'Pending', timestamp: '12:00 PM' }
];

// --- RESTful API Endpoints ---

// 1. GET: Fetch all items
app.get('/api/tasks', (req, res) => {
  res.status(200).json({
    success: true,
    total: tasks.length,
    data: tasks
  });
});

// 2. POST: Create a new item
app.post('/api/tasks', (req, res) => {
  const { title, priority } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Task title is required.' });
  }

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    priority: priority || 'Medium',
    status: 'Pending',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  tasks.unshift(newTask);
  res.status(201).json({ success: true, data: newTask });
});

// 3. PUT: Update item status
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  // Cycle status: Pending -> In Progress -> Completed -> Pending
  const statusCycle = { 'Pending': 'In Progress', 'In Progress': 'Completed', 'Completed': 'Pending' };
  task.status = statusCycle[task.status] || 'Pending';

  res.status(200).json({ success: true, data: task });
});

// 4. DELETE: Remove an item
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== taskId);

  if (tasks.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  res.status(200).json({ success: true, message: `Task ${taskId} removed.` });
});

app.listen(PORT, () => {
  console.log(`Task 5 REST API running at http://localhost:${PORT}`);
});
