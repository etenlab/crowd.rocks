# crowd.rocks

## Introduction

crowd.rocks is a server/client version of a peer-to-peer research project.

Differences:
- No data is stored on the client. crowd.rocks is a normal server/client app that uses GraphQL.
- No ORM.
- Ionic only components. This will be deployed on both app stores.

## Setup

### Env
`docker-compose --env-file .env up -d`

### API
API is nestjs and uses `yarn`. `yarn set version berry` then `yarn run start` to run.
`yarn dlx @yarnpkg/sdks vscode` is needed for vscode to find dependencies

### Frontend
Frontend is ionic react and uses `npm`. `ionic serve` to run.
