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
	@echo "Stopping the Docker container..."
	docker stop $(CONTAINER_NAME)

clean:
	@echo "Cleaning up the container..."
	docker rm $(CONTAINER_NAME)

rmi:
	@echo "Removing the Docker image..."
	docker rmi $(IMAGE_NAME):$(TAG)

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