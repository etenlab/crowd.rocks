# crowd.rocks infra

Project infrastructure written in CDK Typescript.

This project consist of:

- 1 Postgres database (Aurora Serverless v2)
- 1 ECS cluster
- 1 Application load balancer
- 1 ECS service (Fargate deployment)
- 1 public S3 bucket
- 1 static S3 website + Cloudfront for docs

## First-time deployment

1. Configured your AWS CLI with correct credentials. See [AWS CLI Configuration basics](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) for reference.
2. Bootstrap CDK project in your AWS account if you have not done so already. See [CDK Bootstrapping docs](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html) for reference.
3. Install project dependencies: `npm ci`.
4. Check environment configuration in `./config/dev.yaml` for developnet environment. Use `./config/prod.yaml` for production.
5. Deploy Common stack: `npm run deploy-common:dev`
6. Deploy Database stack `npm run deploy-database:dev`
7. Deploy Api Service stack: `npm run deploy-api:dev`.
8. Deploy Docs App stack: `npm run deploy-docs:dev`.

## How to redeploy API stack

Dev: `npm run deploy-api:dev`
Prod: `npm run deploy-api:prod`

## Useful commands

- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
- `cdk context --clear` clear values stored in local `cdk.context.json`. Useful if deployment fails with "resource not found" kind of error.
