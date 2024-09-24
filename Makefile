# Variables
IMAGE_NAME=admin-panel-server-dev
TAG=latest
CONTAINER_NAME=admin-panel-dev-container
PORT=80
DOCKER_COMPOSE_FILE=compose.yaml
TESTING_CONTAINER_NAME=admin-panel-dev-container-test

build:
	@echo "Building the Docker image using docker-compose..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) build

run:
	@echo "Running the Docker container in $(ENV) environment using docker-compose..."
ifeq ($(ENV), local)
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
else ifeq ($(ENV), ec2)
	docker-compose -f $(DOCKER_COMPOSE_FILE) -e ECR_IMAGE=$(ECR_IMAGE) up -d
else
	$(error Unsupported environment: $(ENV))
endif

stop:
	@echo "Stopping the Docker container using docker-compose..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

clean:
	@echo "Cleaning up the container using docker-compose..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) down --rmi all --volumes --remove-orphans

rmi:
	@echo "Removing the Docker image (if exists)..."
	@if [ $(shell docker images -q $(IMAGE_NAME):$(TAG)) ]; then \
		docker rmi $(IMAGE_NAME):$(TAG); \
	else \
		echo "Image $(IMAGE_NAME):$(TAG) does not exist."; \
	fi

rebuild: stop clean build

rebuild-run: stop clean build run

ps:
	@echo "Listing running containers using docker-compose..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps

logs:
	@echo "Showing logs for the container using docker-compose..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs $(CONTAINER_NAME)

test-clean:
	@echo "Running tests and cleaning up using docker-compose..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d $(TESTING_CONTAINER_NAME)
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec $(TESTING_CONTAINER_NAME) npm test
	docker-compose -f $(DOCKER_COMPOSE_FILE) down --remove-orphans

push:
	@echo "Tagging and pushing the Docker image to ECR..."
	docker tag $(IMAGE_NAME):$(TAG) $$AWS_ACCOUNT_ID.dkr.ecr.$$AWS_REGION.amazonaws.com/$$ECR_REPOSITORY:$(TAG)
	docker push $$AWS_ACCOUNT_ID.dkr.ecr.$$AWS_REGION.amazonaws.com/$$ECR_REPOSITORY:$(TAG)

build-and-push: rebuild push
