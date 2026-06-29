const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Frontend ke data folder se JSON serve karo
const dataPath = path.join(__dirname, '../../frontend/data');

router.get('/courses', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataPath, 'courses.json')));
  res.json(data);
});

router.get('/lessons', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataPath, 'lessons.json')));
  res.json(data);
});

router.get('/quizzes', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataPath, 'quizzes.json')));
  res.json(data);
});

module.exports = router;