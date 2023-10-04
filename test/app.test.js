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
    // it('should return a 200 status code', async () => {
    //     const response = await request(app).get('/healthz');
    //     expect(response.status).to.equal(200);
    // });

    it('should have cache-control: no-cache header in response', async () => {
        const response = await chai.request(app).get('/healthz');
        expect(response.header['cache-control']).to.equal('no-cache');
    });

    it('should not include any payload in response', async () => {
        const response = await chai.request(app).get('/healthz');
        expect(response.body).to.be.empty;
    });
});