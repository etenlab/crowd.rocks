# crowd.rocks API

## env

look for .env.example

## postgres docker container logs
To see postgres docker container logs, run 
`docker logs -f env-postgres_1-1`

Note:
If you don't see SQL statementes being logged, most likely your postgres docker container was started earlier, with older docker-compose.yml without such parameter, so you should rebuild and start container again:
-ensure that your postgres docker container is started using docker-compose.yml that contains service `postgres_1` with parameter `command: ["postgres", "-c", "log_statement=all"]`
-change directory to env (containing docker-compose.yml):  `cd ../env`
-rebuild and start containers: `docker-compose up -d`


