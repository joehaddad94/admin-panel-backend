ARG NODE_VERSION=20.15.1

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

RUN apk add --no-cache git

ARG GIT_TOKEN
ARG BRANCH_NAME=development
RUN --mount=type=secret,id=GIT_TOKEN \
    git clone -b ${BRANCH_NAME} https://sefact0ry:$(cat /run/secrets/GIT_TOKEN)@github.com/sefact0ry/sef-admin-panel-server.git . 


RUN npm install

EXPOSE 8000

CMD ["npm", "run", "start:dev"]
