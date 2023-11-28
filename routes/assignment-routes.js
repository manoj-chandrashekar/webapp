const express = require('express');
const { check } = require('express-validator');

const assignmentController = require('../controllers/assignment-controller');
const router = express.Router();

const validateAssignment = [
    check('name').not().isEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
    check('points').not().isEmpty().withMessage('Points is required')
    .isInt({ min: 1, max: 100 }).withMessage('Points must be between 1 and 100'),
    check('num_of_attempts').not().isEmpty().withMessage('Num of attempts is required')
    .isInt({ min: 1, max: 100}).withMessage('Num of attempts must be between 1 and 100'),
    check('deadline').not().isEmpty().withMessage('Deadline is required')
];

const validateSubmission = [
    check('assignment_id').not().isEmpty().withMessage('Assignment ID is required'),
    check('submission_url').not().isEmpty().withMessage('Submission URL is required')
    .isURL().withMessage('Submission URL must be a valid URL')
];

router.get('/:id', assignmentController.getById);

router.post('/', validateAssignment, assignmentController.createAssignment);

router.get('/', assignmentController.getAll);

router.delete('/:id', assignmentController.deleteAssignment);

router.put('/:id', validateAssignment, assignmentController.updateAssignment);

router.post('/:id/submissions', validateSubmission, assignmentController.createSubmission);

router.patch('/', assignmentController.unsupportedMethods);

router.patch('/:id', assignmentController.unsupportedMethods);

module.exports = router;