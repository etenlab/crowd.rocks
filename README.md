# crowd.rocks

## Introduction

crowd.rocks is a server/client version of a peer-to-peer research project.

Differences:
- No data is stored on the client. crowd.rocks is a normal server/client app that uses GraphQL.
- No ORM.
- No graph schema. We are using normal relational schema tables.
- 100% Ionic components. This will be deployed on both app stores so we won't use MUI.

## Setup

### Env
`docker-compose --env-file .env up -d`

### API
1. add env vars: run the env var exports in the API readme file
1. install dependencies: `yarn set version berry` then `yarn` 
1. setup vscode to find dependencies: `yarn dlx @yarnpkg/sdks vscode`
1. run API: `yarn run start`
1. GraphQL playground: `http://localhost:3000/graphql`

### Frontend
Frontend is Ionic React and uses `npm`. `ionic serve` to run.

## Development

1. Setup your environment and get the API and frontend projects running.
1. Create database schema in `./api/src/core/sql/schema/v1.schema.sql`.
1. Update the `core/database-version.control.service.ts` file as needed when adding new DB functions.
1. Cretea a module folder in the API  `components` folder as needed.
1. Add a GraphQL types file and create your resolvers as needed.
1. run `npm run codegen` on the frontend to generate the new types within the frontend project.
1. Create the Ionic React components necessary on the frontend.