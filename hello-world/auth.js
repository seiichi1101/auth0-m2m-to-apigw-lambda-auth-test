'use strict';

const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const util = require('util');

const getToken = (params) => {
  if (!params.type || params.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"');
  }
  const tokenString = params.authorizationToken;
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set');
  }
  const match = tokenString.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
  }
  return match[1];
};

const getAuthentication = async (token) => {
  try{
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new jwt.JsonWebTokenError('invalid token');
    }

    const client = jwksClient({ jwksUri: process.env.JWKS_URI });
    const getSigningKey = util.promisify(client.getSigningKey);
    const key = await getSigningKey(decoded.header.kid);
    const signingKey = key.publicKey || key.rsaPublicKey;
    const tokenInfo = await jwt.verify(token, signingKey, {
      audience: process.env.AUDIENCE,
      issuer: process.env.TOKEN_ISSUER
    });
    return tokenInfo;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.info(error);
      return null;
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.info(error);
      return null;
    } else {
      throw error;
    }
  }
};


const generatePolicy = async (principalId, effect, resource, context) => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    },
    context: context
  };
};

exports.lambdaHandler = async (event) => {
  try {
    console.log(event);
    const token = await getToken(event);
    const res = await getAuthentication(token);
    let policy;
    if (!res){
      policy = await generatePolicy('', 'Deny', event.methodArn, { msg: 'failure' });
    } else{
      policy = await generatePolicy(res.sub, 'Allow', event.methodArn, { msg: 'success' });
    }
    console.log(policy);
    return policy;
  } catch (error) {
    console.error(error);
    throw error;
  }
};