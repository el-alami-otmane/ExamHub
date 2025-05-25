const Filiere = require('../models/Filiere');
const Secteur = require('../models/Secteur');

exports.createFiliere = async (req, res) => {
  try {
    const { name, secteurId, niveaux } = req.body;
    
    if (!name || !secteurId || !niveaux || !Array.isArray(niveaux) || niveaux.length === 0) {
      return res.status(400).json({ error: 'Name, secteurId, and at least one niveau are required' });
    }

    const secteur = await Secteur.findById(secteurId);
    if (!secteur) {
      return res.status(404).json({ error: 'Secteur not found' });
    }
    
    const existingFiliere = await Filiere.findOne({ name });
    if (existingFiliere) {
      return res.status(400).json({ error: 'Filiere already exists' });
    }
    
    const validNiveaux = ['Qualification', 'Technicien', 'Technicien Spécialisé'];
    for (const niveau of niveaux) {
      if (!validNiveaux.includes(niveau)) {
        return res.status(400).json({ error: `Invalid niveau: ${niveau}` });
      }
    }

    const filiere = new Filiere({ name, secteur: secteurId, niveaux });
    await filiere.save();
    res.status(201).json(filiere);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllFilieres = async (req, res) => {
  try {
    const filieres = await Filiere.find().populate('secteur');
    res.json(filieres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFilieresBySecteur = async (req, res) => {
  try {
    const filieres = await Filiere.find({ secteur: req.params.secteurId }).populate('secteur');
    res.json(filieres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNiveauxByFiliere = async (req, res) => {
  try {
    const filiere = await Filiere.findById(req.params.filiereId);
    if (!filiere) {
      return res.status(404).json({ error: 'Filiere not found' });
    }
    res.json(filiere.niveaux);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFiliere = async (req, res) => {
  try {
    const filiere = await Filiere.findByIdAndDelete(req.params.id);
    if (!filiere) {
      return res.status(404).json({ error: 'Filiere not found' });
    }
    res.json({ message: 'Filiere deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};