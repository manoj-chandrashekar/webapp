const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const sequelize = require('./util/database');
const basicAuth = require('./util/basic-auth');
const Account = require('./models/account');
const Assignment = require('./models/assignment');
const HttpError = require('./models/http-error');
const processCsv = require('./util/process-csv');
const logger = require('./util/logger');

const healthRoutes = require('./routes/health-routes');
const assignmentRoutes = require('./routes/assignment-routes');
const Submission = require('./models/submission');

const app = express();

app.use(bodyParser.json());
app.use(cors());
// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

Account.hasMany(Assignment, {
  foreignKey: 'account_id'
});
Assignment.belongsTo(Account, {
  foreignKey: 'account_id'
});

Assignment.hasMany(Submission, {
  foreignKey: 'assignment_id'
});
Submission.belongsTo(Assignment, {
  foreignKey: 'assignment_id'
});

let dbConnectionOK = false;

sequelize.sync()
  .then(() => {
    console.log('Database is synchronized with the model.');
    logger.info('Database is synchronized with the model.');
    dbConnectionOK = true;
    processCsv();
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err);
    dbConnectionOK = false;
  });

app.use('/healthz', healthRoutes);
app.use((req, res, next) => {
  if (!dbConnectionOK) {
    res.status(503).send('Service Unavailable');
    return;
  }
  next();
});
app.use('/demo/assignments', basicAuth, assignmentRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 400);
    res.json({message: error.message || 'Bad Request'});
    if(error.code && error.code.toString().startsWith('5')) {
        logger.error('A server error occured', error);
    }
});

app.listen(8080);

module.exports = app;
