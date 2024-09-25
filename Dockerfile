ARG NODE_VERSION=20.15.1

# Stage 1: Build
FROM node:${NODE_VERSION} AS build

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: Runtime
FROM node:${NODE_VERSION} AS runtime

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 80

CMD ["npm", "run", "start:dev"]
