'use strict';


describe('Tests index', function () {
  let auth, context;
  let event = {
    type: 'TOKEN',
    methodArn:
      'arn:aws:execute-api:ap-northeast-1:012345678901:apiid/Dev/GET/hello',
  };

  before(async () => {
    auth = require('../../auth.js');
    const request = require('request');
    const util = require('util');

    var options = {
      method: 'POST',
      url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      body: `{"client_id":"${process.env.AUTH0_CLIENT_ID}","client_secret":"${process.env.AUTH0_SECRET}","audience":"${process.env.AUDIENCE}","grant_type":"client_credentials"}`
    };

    const getToken = util.promisify(request);
    const res = await getToken(options);
    const token = JSON.parse(res.body).access_token;
    event.authorizationToken = `Bearer ${token}`;
  });

  it('verifies successful response', async () => {
    const result = await auth.lambdaHandler(event, context);

    const expectedResult = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        }
      ],
    };

    global.expect(result.policyDocument).to.deep.equal(expectedResult);
  });
});
