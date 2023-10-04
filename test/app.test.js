// process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;

const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../app');

describe('Health check API', () => {
    it('should return a 200 status code', async () => {
        chai.request(app)
            .get('/healthz')
            .end((err, response) => {
                response.should.have.status(200);
                done();
            });
    });
    // it('should not include any payload in response', async () => {
    //     const response = await request(app).get('/healthz').expect(200);
    //     expect(response.body).to.be.empty;
    // });
});