process.env.NODE_ENV = 'test';
const sequelize = require('../util/database');

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../app');

// sequelize.sync({force: true});

describe('Health check API', () => {
    it('should return a 200 status code', async () => {
        const response = await request(app).get('/healthz');
        expect(response.status).to.equal(200);
    });

    it('should have cache-control: no-cache header in response', async () => {
        const response = await request(app).get('/healthz').expect(200);
        expect(response.header['cache-control']).to.equal('no-cache');
    });

    it('should not include any payload in response', async () => {
        const response = await request(app).get('/healthz').expect(200);
        expect(response.body).to.be.empty;
    });
});