# crowd.rocks

## Introduction

crowd.rocks is a server/client version of a peer-to-peer research project.

Differences:
- No data is stored on the client. crowd.rocks is a normal server/client app that uses GraphQL.
- No ORM.
- No graph schema. We are using normal relational schema tables.
- Ionic only components. This will be deployed on both app stores.

## Setup

### Env
`docker-compose --env-file .env up -d`

### API
API is nestjs and uses `yarn`. `yarn set version berry` then `yarn run start` to run.
`yarn dlx @yarnpkg/sdks vscode` is needed for vscode to find dependencies
GraphQL playground: `http://localhost:3000/graphql`

### Frontend
Frontend is Ionic React and uses `npm`. `ionic serve` to run.

## Development

1. Setup your environment and get the API and frontend projects running.
2. Create database schema in `./api/src/core/sql/schema/v1.schema.sql`.
3. Update the `core/database-version.control.service.ts` file as needed when added new DB functions.
3. Cretea a module folder in the API  `components` folder as needed.
3. Add a GraphQL types file and create your resolvers as needed.
4. run `npm run codegen` on the frontend to generate the new types within the frontend project.
5. Create the Ionic React components necessary on the frontend.