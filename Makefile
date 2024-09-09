# Variables
IMAGE_NAME=admin-panel-dev
TAG=latest
CONTAINER_NAME=admin-panel-dev-container
TESTING_CONTAINER_NAME=admin-panel-test
PORT=80

build:
	@echo "Building the Docker image..."
	docker build -t $(IMAGE_NAME):$(TAG) .

run:
	@echo "Running the Docker container..."
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):8000 $(IMAGE_NAME):$(TAG)

stop:
	@echo "Stopping the Docker container (if running)..."
	@if [ $(shell docker ps -q -f name=$(CONTAINER_NAME)) ]; then \
		docker stop $(CONTAINER_NAME); \
	else \
		echo "Container $(CONTAINER_NAME) is not running."; \
	fi

clean:
	@echo "Cleaning up the container (if exists)..."
	@if [ $(shell docker ps -a -q -f name=$(CONTAINER_NAME)) ]; then \
		docker rm $(CONTAINER_NAME); \
	else \
		echo "Container $(CONTAINER_NAME) does not exist."; \
	fi

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
	@echo "Listing running containers..."
	docker ps

logs:
	@echo "Showing logs for the container..."
	docker logs $(CONTAINER_NAME)

test-clean:
	@echo "Running tests and cleaning up..."
	docker run -d --name $(TESTING_CONTAINER_NAME) $(IMAGE_NAME):$(TAG)
	docker exec $(TESTING_CONTAINER_NAME) npm test
	docker stop $(TESTING_CONTAINER_NAME)
	docker rm $(TESTING_CONTAINER_NAME)