.DEFAULT_GOAL := help

install: ## Install project
	./script.sh install --env=${env} --cdn=${cdn}

build: ## build image, usage: make build, make build image=nginx
	./script.sh build ${image}

start: ## Up docker containers, usage: make up
	./script.sh start

stop: ## Stops and removes the docker containers, usage: make down
	./script.sh stop

restart: ## Restart all containers, usage: make restart
	docker-compose restart

status: ## Show containers status, usage: make status
	docker-compose ps

composer: ## Install composer dependency, usage: make composer req=symfony/dotenv
	./script.sh composer require ${req} --no-progress --profile --prefer-dist

composer-update: ## Update composer dependencies
	./script.sh composer update --no-progress --profile --prefer-dist

ssh: ## Enter ssh container, usage : make ssh container=nginx
	docker run -ti ${container} sh

push: ## Push all images to registry
	./script.sh push

pull: ## Pull all images from registry
	./script.sh pull

cache: ## Pull all images from registry
	./script.sh composer cache:clear

frontend-build: ## Run build frontend task
	./script.sh yarn build

gulp: ## Run gulp task
	./script.sh yarn gulp ${run}

clean: ## Clear containers
	docker container prune -f ; \
	docker image prune -f ; \
	docker network prune -f ; \
	docker volume prune -f;

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'
