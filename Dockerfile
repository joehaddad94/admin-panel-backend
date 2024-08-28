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

# Use an official Node runtime as a parent image
ARG NODE_VERSION=20.15.1
FROM node:${NODE_VERSION}-alpine AS base

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies for building the app
RUN apk add --no-cache git python3

# Set environment variables
ARG BRANCH_NAME=development
ARG GIT_TOKEN

# Clone the repository
RUN git clone -b ${BRANCH_NAME} https://sefact0ry:${GIT_TOKEN}@github.com/sefact0ry/sef-admin-panel-server.git .

# Install app dependencies
RUN npm install

# Remove the Git token from the image
RUN rm -rf /root/.git-credentials

# Use a smaller image for runtime
FROM node:${NODE_VERSION}-alpine AS runtime

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=base /usr/src/app /usr/src/app

# Expose the port
EXPOSE 8000

# Healthcheck to ensure the service is up and running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["npm", "run", "start:dev"]

