const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Progress Schema
const progressSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrolled:    { type: Object, default: {} },
  progress:    { type: Object, default: {} },
  quizHistory: { type: Array,  default: [] },
  xp:          { type: Number, default: 0 }
}, { timestamps: true });

const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

// GET /api/progress
router.get('/', auth, async (req, res) => {
  try {
    let data = await Progress.findOne({ userId: req.user.id });
    if (!data) {
      data = await Progress.create({ userId: req.user.id });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/progress
router.post('/', auth, async (req, res) => {
  try {
    const { enrolled, progress, quizHistory, xp } = req.body;
    
    const data = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { enrolled, progress, quizHistory, xp },
      { new: true, upsert: true }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;