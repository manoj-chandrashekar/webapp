const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' }); //TODO

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

module.exports = sns;