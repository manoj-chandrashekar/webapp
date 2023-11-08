const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const Account = require('../models/account');
const logger = require('./logger');

let acc = null;

const basicAuth = async (req, res, next) => {
    const credentials = await auth(req);

    if(!credentials || !await isValidCredentials(credentials)) {
        res.set('WWW-Authenticate', 'Basic');
        logger.info('Basic auth failed. Invalid credentials');
        return res.status(401).send();
    }

    if(acc !== null)
        req.account = acc;
    console.log('Basic auth success');
    next();
};

const isValidCredentials = async (credentials) => {
    
    const account = await Account.findOne({
        where: {
            email: credentials.name
        }
    });

    if(!account) {
        return false;
    }

    const passwordMatch = await bcrypt.compare(credentials.pass, account.password);
    if(passwordMatch) acc = account;

    return passwordMatch;
};

module.exports = basicAuth;