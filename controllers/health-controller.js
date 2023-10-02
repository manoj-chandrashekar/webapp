const sequelize = require('../util/database');

const checkConnection = async (req, res) => {
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
        res.status(200).send();
    } catch(error) {
        res.status(503).send();
    }
};

const otherMethods = (req, res) => {
    res.status(405).send();
};

exports.checkConnection = checkConnection;
exports.otherMethods = otherMethods;