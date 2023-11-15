const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Assignment = require('../models/assignment');
const logger = require('../util/logger');
const Lynx = require('lynx');
const metrics = new Lynx('localhost', 8125);
const { fetchInstanceId } = require('../util/instanceMetadata');

const createAssignment = async (req, res, next) => {
    metrics.increment('assignment_POST');
    const assignment = req.body;
    const account = req.account;

    if (Object.keys(assignment).length === 0 || Object.keys(req.query).length > 0) {
        logger.info('POST v1/assignment - No input body passed for creating');
        return res.status(400).send();
    }

    if (assignment.id || assignment.id === '' || assignment.assignment_created || assignment.assignment_updated) {
        logger.info('POST v1/assignment - Invalid input body passed for creating');
        const inputError = new HttpError('Invalid input passed', 400);
        next(inputError);
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const inputError = new HttpError(errors.array()[0].msg, 400);
        logger.info('POST v1/assignment - Invalid input body passed for creating', inputError);
        return next(inputError);
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
        logger.info('POST v1/assignment - Assignment created successfully');
        res.status(201).json(responseAssignment);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            logger.info('POST v1/assignment - Invalid input body passed for creating');
            const validationError = new HttpError('Invalid input passed', 400);
            return next(validationError);
        } else {
            logger.error('POST v1/assignment - Some error occured', error);
            const otherError = new HttpError('Some error occured', error.code);
            return next(otherError);
        }
    }
}

const getAll = async (req, res, next) => {
    metrics.increment('assignment_GET_ALL');
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        logger.info('GET v1/assignment - Query params or body passed for getting all assignments');
        return res.status(400).send();
    }

    const assignments = await Assignment.findAll({
        attributes: {
            exclude: ['account_id'],
        },
    });
    const id = await fetchInstanceId();
    logger.info('GET v1/assignment - Instance id: '+id);
    res.status(200).json(assignments);
};

const getById = async (req, res, next) => {
    metrics.increment('assignment_GET_BY_ID');
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        logger.info('GET v1/assignment/:id - Query params or body passed for getting assignment by id');
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
        logger.info('GET v1/assignment/:id - Assignment with id '+assignmentId+' not found');
        return res.status(404).send();
    }
    res.status(200).json(assignment);
};

const deleteAssignment = async (req, res, next) => {
    metrics.increment('assignment_DELETE');
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        logger.info('DELETE v1/assignment/:id - Query params or body passed for deleting assignment by id');
        return res.status(400).send();
    }
    const account = req.account;
    const assignmentId = req.params.id;

    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
        logger.info('DELETE v1/assignment/:id - Assignment with id '+assignmentId+' not found');
        return res.status(404).send();
    }

    if (assignment.account_id !== account.id) {
        logger.info('DELETE v1/assignment/:id - User '+account.email+' is not authorized to delete assignment with id '+assignmentId);
        return res.status(403).send();
    }

    await assignment.destroy();
    logger.info('DELETE v1/assignment/:id - Assignment with id '+assignmentId+' deleted successfully');
    res.status(204).send();
};

const updateAssignment = async (req, res, next) => {
    metrics.increment('assignment_PUT');
    const assignment = req.body;
    const account = req.account;
    const assignmentId = req.params.id;

    if (Object.keys(assignment).length === 0 || Object.keys(req.query).length > 0) {
        logger.info('PUT v1/assignment/:id - Invalid input or params present for updating');
        return res.status(400).send();
    }

    if (assignment.id || assignment.id === '' || assignment.assignment_created || assignment.assignment_updated) {
        logger.info('PUT v1/assignment/:id - Invalid input body passed for updating');
        const inputError = new HttpError('Invalid input passed', 400);
        return next(inputError);
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const inputError = new HttpError(errors.array()[0].msg, 400);
        logger.info('PUT v1/assignment/:id - Invalid input body passed for updating', inputError);
        return next(inputError);
    }

    try {

        const fetchedAssignment = await Assignment.findByPk(assignmentId);

        if (!fetchedAssignment) {
            logger.info('PUT v1/assignment/:id - Assignment with id '+assignmentId+' not found');
            return res.status(404).send();
        }

        if (fetchedAssignment.account_id !== account.id) {
            logger.info('PUT v1/assignment/:id - User '+account.email+' is not authorized to update assignment with id '+assignmentId);
            return res.status(403).send();
        }

        await fetchedAssignment.update(assignment, { validate: true });
        logger.info('PUT v1/assignment/:id - Assignment with id '+assignmentId+' updated successfully');
        res.status(204).send();
    } catch(error) {
        if (error.name === 'SequelizeValidationError') {
            logger.info('PUT v1/assignment/:id - Invalid input body passed for updating');
            const validationError = new HttpError('Invalid input passed', 400);
            return next(validationError);
        } else {
            logger.error('PUT v1/assignment/:id - Some error occured', error);
            const otherError = new HttpError('Some error occured', error.code);
            return next(otherError);
        }
    }
};

const unsupportedMethods = (req, res, next) => {
    metrics.increment('assignment_METHOD_NOT_ALLOWED');
    logger.info('Method not allowed.');
    res.status(405).send();
};

exports.createAssignment = createAssignment;
exports.getAll = getAll;
exports.getById = getById;
exports.deleteAssignment = deleteAssignment;
exports.updateAssignment = updateAssignment;
exports.unsupportedMethods = unsupportedMethods;

