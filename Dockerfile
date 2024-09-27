ARG NODE_VERSION=20.15.1

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 80

CMD ["npm", "run", "start:dev"]

