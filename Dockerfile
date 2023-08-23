FROM node:16

# Create app directory
WORKDIR /usr/src/etenlab/crowd-rocks

COPY frontend /frontend/
COPY api /api/

ARG BUILD_MODE

WORKDIR /frontend

RUN npm install
RUN if [ "$BUILD_MODE" = "staging" ]; then \
        npm run build:staging; \
    else \
        npm run build:prod; \
    fi

WORKDIR /../api

RUN yarn install
RUN yarn build

CMD [ "yarn", "run", "start:prod" ]