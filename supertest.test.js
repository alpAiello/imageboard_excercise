const supertest = require('supertest');
const app = require('./server.js').app;

test('Request to /api/images is successful', () => {
    return supertest(app).get('/api/images').then(res => {
        expect(res.statusCode).toBe(200);
    });
});
