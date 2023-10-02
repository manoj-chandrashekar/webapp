const express = require('express');

const healthRoutes = require('./routes/health-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
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