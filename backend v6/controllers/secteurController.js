const Secteur = require('../models/Secteur');

exports.createSecteur = async (req, res) => {
  try {
    const { name } = req.body;
    const secteur = new Secteur({ name });
    await secteur.save();
    res.status(201).json(secteur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSecteurs = async (req, res) => {
  try {
    const secteurs = await Secteur.find();
    res.json(secteurs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSecteurById = async (req, res) => {
  try {
    const secteur = await Secteur.findById(req.params.id);
    if (!secteur) {
      return res.status(404).json({ error: 'Secteur not found' });
    }
    res.json(secteur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSecteur = async (req, res) => {
  try {
    const secteur = await Secteur.findByIdAndDelete(req.params.id);
    if (!secteur) {
      return res.status(404).json({ error: 'Secteur not found' });
    }
    res.json({ message: 'Secteur deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};