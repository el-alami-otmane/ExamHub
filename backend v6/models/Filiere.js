const mongoose = require('mongoose');

const FiliereSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  secteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Secteur',
    required: true
  },
  niveaux: {
    type: [String],
    enum: ['Qualification', 'Technicien', 'Technicien Spécialisé'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Filiere', FiliereSchema);