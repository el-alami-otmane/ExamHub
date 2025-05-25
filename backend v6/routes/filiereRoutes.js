 
const express = require('express');
const router = express.Router();
const filiereController = require('../controllers/filiereController');

router.post('/', filiereController.createFiliere);
router.get('/', filiereController.getAllFilieres);
router.get('/secteur/:secteurId', filiereController.getFilieresBySecteur);
router.get('/:filiereId/niveaux', filiereController.getNiveauxByFiliere);
router.delete('/:id', filiereController.deleteFiliere);

module.exports = router;