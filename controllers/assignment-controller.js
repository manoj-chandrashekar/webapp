const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Assignment = require('../models/assignment');

const createAssignment = async (req, res, next) => {
    const assignment = req.body;
    const account = req.account;

    if (Object.keys(assignment).length === 0 || Object.keys(req.query).length > 0) {
        return res.status(400).send();
    }

    if (assignment.id || assignment.id === '' || assignment.assignment_created || assignment.assignment_updated) {
        const inputError = new HttpError('Invalid input passed', 422);
        next(inputError);
    }

    try {
        const createdAssignment = await Assignment.create(assignment);
        await createdAssignment.setAccount(account);

        const responseAssignment = {
            id: createdAssignment.id,
            name: createdAssignment.name,
            points: createdAssignment.points,
            num_of_attempts: createdAssignment.num_of_attempts,
            deadline: createdAssignment.deadline,
            assignment_created: createdAssignment.assignment_created,
            assignment_updated: createdAssignment.assignment_updated,
        };

        res.status(201).json(responseAssignment);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const validationError = new HttpError('Invalid input passed', 422);
            return next(validationError);
        } else {
            const otherError = new HttpError('Some error occured', error.code);
            return next(otherError);
        }
    }
}

const getAll = async (req, res, next) => {
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        return res.status(400).send();
    }

    const assignments = await Assignment.findAll({
        attributes: {
            exclude: ['account_id'],
        },
    });
    if (assignments.length === 0) {
        return res.status(404).send();
    }
    res.status(200).json(assignments);
};

const getById = async (req, res, next) => {
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        return res.status(400).send();
    }
    const assignmentId = req.params.id;

    const assignment = await Assignment.findAll({
        where: {
            id: assignmentId,
        },
        attributes: {
            exclude: ['account_id'],
        },
    });
    if (assignment.length === 0) {
        return res.status(404).send();
    }
    res.status(200).json(assignment);
};

const deleteAssignment = async (req, res, next) => {
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        return res.status(400).send();
    }
    const account = req.account;
    const assignmentId = req.params.id;

    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
        return res.status(404).send();
    }

    if (assignment.account_id !== account.id) {
        return res.status(401).send();
    }

    await assignment.destroy();
    res.status(204).send();
};

const updateAssignment = async (req, res, next) => {
    const assignment = req.body;
    const account = req.account;
    const assignmentId = req.params.id;

    if (Object.keys(assignment).length === 0 || Object.keys(req.query).length > 0) {
        return res.status(400).send();
    }

    if (assignment.id || assignment.id === '' || assignment.assignment_created || assignment.assignment_updated) {
        const inputError = new HttpError('Invalid input passed', 422);
        return next(inputError);
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const inputError = new HttpError(errors.array()[0].msg, 422);
        return next(inputError);
    }

    try {

        const fetchedAssignment = await Assignment.findByPk(assignmentId);

        if (!fetchedAssignment) {
            return res.status(404).send();
        }

        if (fetchedAssignment.account_id !== account.id) {
            return res.status(401).send();
        }

        await fetchedAssignment.update(assignment, { validate: true });
        res.status(204).send();
    } catch(error) {
        console.error('Validation Errors:', error);
        if (error.name === 'SequelizeValidationError') {
            const validationError = new HttpError('Invalid input passed', 422);
            return next(validationError);
        } else {
            const otherError = new HttpError('Some error occured', error.code);
            return next(otherError);
        }
    }
};

exports.createAssignment = createAssignment;
exports.getAll = getAll;
exports.getById = getById;
exports.deleteAssignment = deleteAssignment;
exports.updateAssignment = updateAssignment;

