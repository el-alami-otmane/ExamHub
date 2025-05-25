 
const express = require('express');
const router = express.Router();
const secteurController = require('../controllers/secteurController');

router.post('/', secteurController.createSecteur);
router.get('/', secteurController.getAllSecteurs);
router.get('/:id', secteurController.getSecteurById);
router.delete('/:id', secteurController.deleteSecteur);

module.exports = router;