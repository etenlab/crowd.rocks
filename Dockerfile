FROM node:16

# Create app directory
WORKDIR /usr/src/etenlab/crowd-rocks

COPY frontend .
COPY api .

WORKDIR /user/src/etenlab/crowd-rocks/frontend

RUN npm install
RUN npm run build

WORKDIR /user/src/etenlab/crowd-rocks/api

RUN yarn install
RUN yarn build

CMD [ "yarn", "run", "start:prod" ]