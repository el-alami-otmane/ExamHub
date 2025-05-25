 
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

router.post('/', examController.uploadFiles, examController.createExam);
router.get('/', examController.getAllExams);
router.get('/:id', examController.getExamById);
router.get('/:id/download-exam', examController.downloadExamFile);
router.get('/:id/download-solution', examController.downloadSolutionFile);
router.delete('/:id', examController.deleteExam);
// In examRoutes.js
router.patch('/:id/downloads', examController.incrementDownloads);
router.get('/filtered', examController.getFilteredExams);
router.put('/:id', examController.uploadFiles, examController.updateExam);

module.exports = router;