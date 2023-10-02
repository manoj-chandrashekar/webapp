const express = require('express');

const sequelize = require('./util/database');
const Account = require('./models/account');
const Assignment = require('./models/assignment');
const healthRoutes = require('./routes/health-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(express.json());

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

sequelize.sync({alter: true})
  .then(() => {
    console.log('Database is synchronized with the model.');
  })
  .catch((err) => {
    console.error('Error synchronizing the database:', err);
  });

app.use('/healthz', healthRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 400).send();
});

app.listen(8080);
