const express = require("express");
const path = require("path");
const app = express();
const PORT = 3001;

// Temporary in-memory storage for validated records
const temporaryStorage = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// GET Route: Render the form and existing saved records
app.get("/", (req, res) => {
  res.render("index", { 
    errorMessage: null, 
    records: temporaryStorage, 
    formData: {} 
  });
});

// POST Route: Server-side validation and storage
app.post("/submit", (req, res) => {
  const { username, email, age, phone } = req.body;
  let error = null;

  // Server-side validation checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!username || username.trim().length < 3) {
    error = "Server Validation Error: Name must be at least 3 characters long.";
  } else if (!email || !emailRegex.test(email)) {
    error = "Server Validation Error: Please provide a valid email format.";
  } else if (!age || isNaN(age) || Number(age) < 18 || Number(age) > 100) {
    error = "Server Validation Error: Age must be a number between 18 and 100.";
  } else if (!phone || !phoneRegex.test(phone)) {
    error = "Server Validation Error: Phone number must be exactly 10 digits.";
  }

  if (error) {
    return res.render("index", { 
      errorMessage: error, 
      records: temporaryStorage, 
      formData: { username, email, age, phone } 
    });
  }

  // Store valid entry in server memory
  temporaryStorage.push({
    id: temporaryStorage.length + 1,
    username: username.trim(),
    email: email.trim(),
    age: Number(age),
    phone: phone.trim(),
    createdAt: new Date().toLocaleTimeString()
  });

  res.render("index", { 
    errorMessage: null, 
    records: temporaryStorage, 
    formData: {} 
  });
});

app.listen(PORT, () => {
  console.log(`Task 2 server running at http://localhost:${PORT}`);
});
