'use strict';

const app = require('../../app.js');
var event, context;

describe('Tests index', function () {
  it('verifies successful response', async () => {
    const result = await app.lambdaHandler(event, context);

    global.expect(result).to.be.an('object');
    global.expect(result.statusCode).to.equal(200);
    global.expect(result.body).to.be.an('string');

    let response = JSON.parse(result.body);

    global.expect(response).to.be.an('object');
    global.expect(response.message).to.be.equal('hello world');
    // expect(response.location).to.be.an("string");
  });
});
