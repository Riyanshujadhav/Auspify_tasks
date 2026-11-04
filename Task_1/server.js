const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { data: null });
});

app.post('/submit', (req, res) => {
  const { name, email, course } = req.body;
  res.render('index', { data: { name, email, course } });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
