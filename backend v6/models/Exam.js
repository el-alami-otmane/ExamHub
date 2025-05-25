const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  secteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Secteur',
    required: true
  },
  filiere: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Filiere',
    required: true
  },
  niveau: {
    type: String,
    required: true
  },
  examFile: {
    type: String,
    required: true
  },
  solutionFile: {
    type: String
  },
  downloads: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exam', ExamSchema);