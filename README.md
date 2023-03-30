# central-services-backend
This repo holds the logic, infrastructure and CI/CD for Central Service Backend

# About
The Central Service backend is a fleet of serverless Lambda functions, which uses Github actions as the primary runner for CI/CD as well as AWS Cloudformation for Infrastructure as code practices. The lambdas interact with our primary dynamoDB instance, except for the AssetLookupLambda which interacts with our RDS instance.

# Links
- Swagger: https://d2r0ndfdhrqmal.cloudfront.net/
- Api invoke endpoint: https://64edih52t4.execute-api.us-west-2.amazonaws.com/prod/v1/