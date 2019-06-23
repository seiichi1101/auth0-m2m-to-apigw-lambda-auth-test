#!/usr/bin/env bash

sam build
sam package --s3-bucket auth0-test-nodejs10-artifacts --output-template-file packaged.yaml
sam deploy \
    --template-file packaged.yaml \
    --stack-name auth0-test-nodejs10-stack \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        JwksUri=${JWKS_URI} \
        Audience=${AUDIENCE} \
        TokenIssuer=${TOKEN_ISSUER}
