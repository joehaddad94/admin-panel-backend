# ARG NODE_VERSION=20.15.1

# FROM node:${NODE_VERSION}-alpine AS base

# WORKDIR /usr/src/app

# RUN apk add --no-cache git python3

# ARG GIT_TOKEN
# ARG BRANCH_NAME=development

# RUN git clone -b ${BRANCH_NAME} https://sefact0ry:${GIT_TOKEN}@github.com/sefact0ry/sef-admin-panel-server.git .

# RUN npm install

# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:8000/health || exit 1

# EXPOSE 8000

# CMD ["npm", "run", "start:dev"]

# ARG NODE_VERSION=20.15.1

# FROM node:${NODE_VERSION}-alpine AS base

# WORKDIR /usr/src/app

# RUN apk add --no-cache python3 make g++ 

# COPY . .

# RUN npm install

# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:8000/health || exit 1

# EXPOSE 80

# CMD ["npm", "run", "start:dev"]

ARG NODE_VERSION=20.15.1

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 80

CMD ["npm", "run", "start:dev"]

