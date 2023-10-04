const express = require('express');
const { check } = require('express-validator');

const assignmentController = require('../controllers/assignment-controller');
const router = express.Router();

router.get('/:id', assignmentController.getById);

router.post('/', assignmentController.createAssignment);

router.get('/', assignmentController.getAll);

router.delete('/:id', assignmentController.deleteAssignment);

router.put('/:id', 
[
    check('name').not().isEmpty().withMessage('Name is required'),
    check('points').not().isEmpty().withMessage('Points is required')
    .isInt({ min: 1, max: 100 }).withMessage('Points must be between 1 and 100'),
    check('num_of_attempts').not().isEmpty().withMessage('Num of attempts is required')
    .isInt({ min: 1, max: 100}).withMessage('Num of attempts must be between 1 and 100'),
    check('deadline').not().isEmpty().withMessage('Deadline is required')
], assignmentController.updateAssignment);

module.exports = router;