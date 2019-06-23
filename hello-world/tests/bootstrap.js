global.chai = require('chai');
global.chai.config.truncateThreshold = 0;
global.expect = global.chai.expect;
global.assert = global.chai.assert;


process.env.AUTH0_DOMAIN = '<YOUR_AUTH0_DOMAIN>';
process.env.AUTH0_CLIENT_ID = '<YOUR_AUTH0_CLIENT_ID>';
process.env.AUTH0_SECRET = '<YOUR_AUTH0_SECRET>';
process.env.AUDIENCE = '<YOUR_AUDIENCE>';
process.env.JWKS_URI = '<YOUR_JWKS_URI>';
process.env.TOKEN_ISSUER = '<YOUR_TOKEN_ISSUER>';
