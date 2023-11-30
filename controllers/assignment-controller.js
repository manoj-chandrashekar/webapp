const { validationResult } = require('express-validator');
require('dotenv').config();
const HttpError = require('../models/http-error');
const Assignment = require('../models/assignment');
const Submission = require('../models/submission');
const UserAssignment = require('../models/user-assignment');
const logger = require('../util/logger');
const Lynx = require('lynx');
const metrics = new Lynx('localhost', 8125);
const sns = require('../providers/sns-provider');
const { fetchInstanceID } = require('../util/instanceMetadata');

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
    if (!errors.isEmpty()) {
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
    try {
        // const id = await fetchInstanceID();
        logger.info('GET v1/assignment - Instance id: ' + id);
        res.status(200).json(assignments);
    } catch (error) {
        logger.error('GET v1/assignment - Connection to instance metadata service failed', error);
        res.status(200).json(assignments);
    }
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
        logger.info('GET v1/assignment/:id - Assignment with id ' + assignmentId + ' not found');
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
        logger.info('DELETE v1/assignment/:id - Assignment with id ' + assignmentId + ' not found');
        return res.status(404).send();
    }

    if (assignment.account_id !== account.id) {
        logger.info('DELETE v1/assignment/:id - User ' + account.email + ' is not authorized to delete assignment with id ' + assignmentId);
        return res.status(403).send();
    }

    const submissionCount = await assignment.countSubmissions();
    if (submissionCount > 0) {
        logger.info('DELETE v1/assignment/:id - Assignment with id ' + assignmentId + ' has submissions');
        const conflictError = new HttpError('Cannot delete assignment as there are submissions against it.', 409);
        return next(conflictError);
    }

    await assignment.destroy();
    logger.info('DELETE v1/assignment/:id - Assignment with id ' + assignmentId + ' deleted successfully');
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
    if (!errors.isEmpty()) {
        const inputError = new HttpError(errors.array()[0].msg, 400);
        logger.info('PUT v1/assignment/:id - Invalid input body passed for updating', inputError);
        return next(inputError);
    }

    try {

        const fetchedAssignment = await Assignment.findByPk(assignmentId);

        if (!fetchedAssignment) {
            logger.info('PUT v1/assignment/:id - Assignment with id ' + assignmentId + ' not found');
            return res.status(404).send();
        }

        if (fetchedAssignment.account_id !== account.id) {
            logger.info('PUT v1/assignment/:id - User ' + account.email + ' is not authorized to update assignment with id ' + assignmentId);
            return res.status(403).send();
        }

        await fetchedAssignment.update(assignment, { validate: true });
        logger.info('PUT v1/assignment/:id - Assignment with id ' + assignmentId + ' updated successfully');
        res.status(204).send();
    } catch (error) {
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

const createSubmission = async (req, res, next) => {
    metrics.increment('submission_POST');
    const submission = req.body;
    const assignmentId = req.params.id;
    const account = req.account;

    if (Object.keys(submission).length === 0 || Object.keys(req.query).length > 0) {
        logger.info('POST v1/assignment/:id/submissions - No input body passed for creating');
        return res.status(400).send();
    }

    if (submission.id || submission.id === '' || submission.submission_created || submission.submission_updated) {
        logger.info('POST v1/assignment/:id/submissions - Invalid input body passed for creating');
        const inputError = new HttpError('Invalid input passed', 400);
        next(inputError);
    }

    if(assignmentId !== submission.assignment_id) {
        logger.info('POST v1/assignment/:id/submissions - Assignment id in path and body do not match');
        const inputError = new HttpError('Assignment id in path and body do not match', 400);
        next(inputError);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const inputError = new HttpError(errors.array()[0].msg, 400);
        logger.info('POST v1/assignment/:id/submissions - Invalid input body passed for creating', inputError);
        return next(inputError);
    }

    try {
        const fetchedAssignment = await Assignment.findByPk(assignmentId);

        if (!fetchedAssignment) {
            logger.info('POST v1/assignment/:id/submissions - Assignment with id ' + assignmentId + ' not found');
            const errorOutput = new HttpError('Assignment with id ' + assignmentId + ' not found', 400);
            next(errorOutput);
        }

        const currentDate = new Date();
        if (currentDate > new Date(fetchedAssignment.deadline)) {
            logger.info('POST v1/assignment/:id/submissions - Assignment with id ' + assignmentId + ' passed deadline');
            const errorOutput = new HttpError('Assignment deadline has passed', 423);
            next(errorOutput);
        }

        const userAssignment = await UserAssignment.findOne({
            where: {
                user_id: account.id,
                assignment_id: assignmentId,
            },
        });

        if(userAssignment) {
            if(userAssignment.attempts >= fetchedAssignment.num_of_attempts) {
                logger.info('POST v1/assignment/:id/submissions - Maximum number of attempts reached for assignment ' + assignmentId + ' for user ' + account.email);
                const errorOutput = new HttpError('Maximum number of submission attempts reached for assignment', 403);
                next(errorOutput);
            }
            await userAssignment.increment('attempts');
        } else {
            await UserAssignment.create({
                user_id: account.id,
                assignment_id: assignmentId,
                attempts: 1,
            });
        }

        const createdSubmission = await Submission.create(submission);
        await createdSubmission.setAssignment(fetchedAssignment);

        const message = {
            name: account.first_name,
            email: account.email,
            url: req.body.submission_url,
        };

        const params = {
            TopicArn: process.env.SNS_TOPIC_ARN,
            Message: JSON.stringify(message),
        }

        sns.publish(params, (err, data) => {
            if(err) {
                logger.error('POST v1/assignment/:id/submissions - Error publishing to SNS', err);
                console.error(err, err.stack);
            } else {
                logger.info('POST v1/assignment/:id/submissions - Message published to SNS', data);
                console.log("Message published to SNS");
            }
        });

        const responseSubmission = {
            id: createdSubmission.id,
            assignment_id: createdSubmission.assignment_id,
            account_id: createdSubmission.account_id,
            submission_created: createdSubmission.submission_created,
            submission_updated: createdSubmission.submission_updated,
        };
        logger.info('POST v1/assignment/:id/submissions - Submission created successfully');
        res.status(201).json(responseSubmission);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            logger.info('POST v1/assignment/:id/submissions - Invalid input body passed for creating');
            const validationError = new HttpError('Invalid input passed', 400);
            return next(validationError);
        } else {
            logger.error('POST v1/assignment/:id/submissions - Some error occured', error);
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
exports.createSubmission = createSubmission;

