## PROJECT
export ENV ?= dev
export PROJECT = hces

## PATHS
export BIN_ROOT_PATH = ./bin
export UTIL_ROOT_PATH = $(realpath $(BIN_ROOT_PATH)/util)
export UTIL_PATH = $(UTIL_ROOT_PATH)/util.sh

#ifndef CI
## dev.env
	#include dev.env
	#export $(shell sed 's/=.*//' dev.env)
#endif

## VERSION
ifeq "$(ENV)" "dev"
  export VERSION = dev
endif

DC=docker compose -p $(PROJECT)

# Help target settings
INFO = Showing targets for all of ENV(default: dev)
EXTRA_MAKE_ARGS = ENV=test|prod
HELP_TARGET_MAX_CHAR_NUM = 30
HAS_DEPS = yes
.DEFAULT_GOAL := help
include $(UTIL_ROOT_PATH)/MakeHelp

# Check version is sets and is not help target
ifneq ($(MAKECMDGOALS),)
  ifneq ($(MAKECMDGOALS),help)
    ifndef VERSION
      $(error VERSION is not set)
    endif
  endif
endif

ifeq "$(ENV)" "prod"
## prod targets
endif

ifeq "$(ENV)" "dev"

init_devenv:
	cp ./.vscode/settings.json.template ./.vscode/settings.json

## Reinitialize testing env
up:
	if [ "$CI" = "1" ]; then
		mkdir -p ./tmp/docker
		chmod 777 ./tmp/docker
		chmod 640 -R ./docker/ca/certs/db
	fi
	$(DC) -f docker-compose-dev.yaml --env-file ./docker/dev/.env up -d --wait --wait-timeout 5
	sleep 3

## Clear testing env
down:
	docker compose -p $(PROJECT) down -t 2

build_dev_image:
	DOCKER_BUILDKIT=1 docker build -t hces/dev:latest -f ./docker/app/Dockerfile --target=dev .
endif