# crowd.rocks

## Introduction

crowd.rocks is a server/client version of a peer-to-peer research project.

Differences:
- No data is stored on the client. crowd.rocks is a normal server/client app that uses GraphQL.
- No ORM.
- No graph schema. We are using normal relational schema tables.
- 100% Ionic components. This will be deployed on both app stores so we won't use MUI.

## Setup
Commands are run from each project folder (`env`, `api`, `frontend`, `infra`).

### Env

#### Start Environment
`docker-compose --env-file .env up -d`

#### (optional) View Database Query Logs
`docker logs -f env_postgres_1_1`

Note:
If you don't see SQL statementes being logged, most likely your postgres docker image  was built earlier. So you should rebuild and start container again:
-change directory to env (containing docker-compose.yml):  `cd ../env`
-rebuild `docker-compose build` and start containers: `docker-compose --env-file .env up -d`

#### (optional) Enable plpgsql procedures/functions debugging 
use postgres tools or pgadmin or any other tool to execute command:
```sql
CREATE EXTENSION pldbgapi
```
Check current postgers config file:
```sql
SHOW config_file;
```
it shoud be '/etc/postgresql.conf'. If not - something gone wrong with posgtres image build. Try to rebuild them:
`docker-compose build`

Now you can use pgadmin to debug plpgsql procedures/functions.


### API
1. open API folder in new vscode window
1. add env vars: run the env var exports in the API readme file
1. install dependencies: `yarn set version berry` then `yarn` 
1. setup vscode to find dependencies: `yarn dlx @yarnpkg/sdks vscode`
1. run API: `yarn run start --watch`
1. GraphQL playground: `http://localhost:3000/graphql`

### Frontend
Frontend is Ionic React 
1. install ionic globally: `npm install -g @ionic/cli`
1. install dependencies: `npm i`
1. run: `ionic serve` or `npm run dev`

#### Android Build
There may be times when capacitor builds at a different api level than what Android Studio uses. At least right now, it's building Android apps at the SDK version 33, when the Android Studio is at 34. Just for now you can change the following in variables.gradle if you have capacitor generate android app:
```
// generated was 33
compileSdkVersion = 34 
targetSdkVersion = 34
```

## Development

1. Setup your docker environment and get the API and frontend projects running.
1. Create database schema in `./api/src/core/sql/schema/v1.schema.sql`.
1. Update the `core/database-version.control.service.ts` file as needed when adding new DB functions.
1. Cretea a module folder in the API  `components` folder as needed.
1. Add a GraphQL types file and create your resolvers as needed.
1. With the API running, run `npm run codegen` on the frontend to generate the new types within the frontend project.
1. Create the Ionic React components necessary on the frontend.

### Utils lib

There some imports in the API and Frontend which rely on utils/dist folder.
So, if anything in the utils lib was changed, utils should be rebuilt to allow these changes be imported by API and Frontend:
```bash
$ cd utils
$ npm run build
```


Its also a good idea to run `npm run codegen` on the frontend if you have messed around 
with GraphQL types anywhere
