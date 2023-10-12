// process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;

const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../app');

describe('Health check API', () => {
    it('should return a 200 status code', async () => {
        const res = await chai.request(app).get("/healthz")
        res.should.have.status(200);
    });
    // it('should not include any payload in response', async () => {
    //     const response = await request(app).get('/healthz').expect(200);
    //     expect(response.body).to.be.empty;
    // });
});