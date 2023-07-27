FROM node:16

# Create app directory
WORKDIR /usr/src/etenlab/crowd-rocks

COPY frontend /frontend/
COPY api /api/

WORKDIR /frontend

RUN npm install
RUN npm run build

WORKDIR /../api

RUN yarn install
RUN yarn build

CMD [ "yarn", "run", "start:prod" ]