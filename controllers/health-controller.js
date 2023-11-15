const sequelize = require('../util/database');
const logger = require('../util/logger');
const Lynx = require('lynx');
const metrics = new Lynx('localhost', 8125);
const { fetchInstanceIP } = require('../util/instanceMetadata');

const checkConnection = async (req, res) => {
    metrics.increment('healthz_GET');
    //to restrict query params in GET request
    if(Object.keys(req.query).length > 0) {
        res.status(400).send();
    }
    //to restrict body in GET request
    if(req.get('content-length') && parseInt(req.get('content-length')) > 0) {
        res.status(400).send();
    }
    try {
        await sequelize.authenticate();
        const id = await fetchInstanceIP();
        logger.info(`GET healthz - Database connection has been established successfully. Instance ID: ${id}`);
        res.status(200).send();
    } catch(error) {
        logger.error('GET healthz - Unable to connect to the database:', error);
        res.status(503).send();
    }
};

const otherMethods = (req, res) => {
    metrics.increment('healthz_METHOD_NOT_ALLOWED')
    logger.error('Method not allowed.');
    res.status(405).send();
};

exports.checkConnection = checkConnection;
exports.otherMethods = otherMethods;