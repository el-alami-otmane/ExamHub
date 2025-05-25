const Exam = require('../models/Exam');
const Filiere = require('../models/Filiere');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage }).fields([
  { name: 'examFile', maxCount: 1 },
  { name: 'solutionFile', maxCount: 1 }
]);

exports.uploadFiles = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

exports.createExam = async (req, res) => {
  try {
    const { title, type, secteurId, filiereId, niveau } = req.body;
    
    if (!title || !type || !secteurId || !filiereId || !niveau) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!req.files || !req.files.examFile) {
      return res.status(400).json({ error: 'Exam file is required' });
    }

    const filiere = await Filiere.findById(filiereId);
    if (!filiere) {
      return res.status(404).json({ error: 'Filiere not found' });
    }

    if (!filiere.niveaux.includes(niveau)) {
      return res.status(400).json({ error: `Niveau ${niveau} is not available for this filiere` });
    }

    const exam = new Exam({
      title,
      type,
      secteur: secteurId,
      filiere: filiereId,
      niveau,
      examFile: req.files.examFile[0].path,
      solutionFile: req.files.solutionFile ? req.files.solutionFile[0].path : null
    });

    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('secteur')
      .populate('filiere');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('secteur')
      .populate('filiere');
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadExamFile = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    exam.downloads += 1;
    await exam.save();

    const filePath = path.join(__dirname, '..', exam.examFile);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadSolutionFile = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam || !exam.solutionFile) {
      return res.status(404).json({ error: 'Solution not found' });
    }

    const filePath = path.join(__dirname, '..', exam.solutionFile);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Delete associated files
    if (exam.examFile) fs.unlinkSync(path.join(__dirname, '..', exam.examFile));
    if (exam.solutionFile) fs.unlinkSync(path.join(__dirname, '..', exam.solutionFile));

    res.json({ message: 'Exam deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// In examController.js
exports.incrementDownloads = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    res.json(exam);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// In your examController.js
exports.getFilteredExams = async (req, res) => {
  try {
    const { secteur, filiere, niveau } = req.query;
    let query = {};
    
    if (secteur) query.secteur = secteur;
    if (filiere) query.filiere = filiere;
    if (niveau) query.niveau = niveau;

    const exams = await Exam.find(query)
      .populate('secteur')
      .populate('filiere')
      .sort({ createdAt: -1 });

    res.json(exams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, secteurId, filiereId, niveau } = req.body;
    
    // Find the existing exam
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Validate required fields
    if (!title || !type || !secteurId || !filiereId || !niveau) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if filiere exists and niveau is valid
    const filiere = await Filiere.findById(filiereId);
    if (!filiere) {
      return res.status(404).json({ error: 'Filiere not found' });
    }

    if (!filiere.niveaux.includes(niveau)) {
      return res.status(400).json({ error: `Niveau ${niveau} is not available for this filiere` });
    }

    // Update basic fields
    exam.title = title;
    exam.type = type;
    exam.secteur = secteurId;
    exam.filiere = filiereId;
    exam.niveau = niveau;

    // Handle file updates if new files are provided
    if (req.files) {
      // Delete old files if they exist
      if (req.files.examFile) {
        if (exam.examFile) {
          fs.unlinkSync(path.join(__dirname, '..', exam.examFile));
        }
        exam.examFile = req.files.examFile[0].path;
      }
      
      if (req.files.solutionFile) {
        if (exam.solutionFile) {
          fs.unlinkSync(path.join(__dirname, '..', exam.solutionFile));
        }
        exam.solutionFile = req.files.solutionFile[0].path;
      }
    }

    await exam.save();
    res.json(exam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};