#!make
# Ensure that a .env file exists in the root directory.
# ifeq ($(wildcard ./.env),)
#   $(shell cp .config/.env.dev .env)
# endif

-include .env

# Set environment variables for local development or CI/CD pipelines
export $(shell sed 's/=.*//' .env)
export DEPLOY_DATE?=$(shell date '+%Y%m%d%H%M')
export GIT_LOCAL_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)


export PROJECT := $(or $(PROJECT),hootsuite-gmb)
export BUILD_TARGET := $(or $(BUILD_TARGET),development)


define deployTag
"${PROJECT}-${DEPLOY_DATE}"
endef

local:          | run-local
deploy-dev:     | deploy-prep-dev deploy-build deploy-push deploy-version
deploy-staging: | deploy-prep-staging deploy-build deploy-push deploy-version
deploy-prod:    | deploy-prep-prod deploy-build-prod deploy-push-prod deploy-version-prod

#################
# Status Output #
#################

print-status:
	@echo " +---------------------------------------------------------+ "
	@echo " | Current Settings                                        | "
	@echo " +---------------------------------------------------------+ "
	@echo " | BRANCH : $(GIT_LOCAL_BRANCH) "
	@echo " | PROFILE: $(PROFILE) "
	@echo " | ACNT ID: $(ACCOUNT_ID) "
	@echo " | REGION: $(REGION) "
	@echo " | ENVIRONMENT: $(ENVIRONMENT) "
	@echo " | APPLICATION: $(PROJECT) "
	@echo " +---------------------------------------------------------+ "

# Generates ECR (Elastic Container Registry) repos, given the proper credentials
create-ecr-repos:
	@echo "+\n++ Creating EC2 Container repositories...\n+"
	@$(shell aws ecr get-login --no-include-email --profile $(PROFILE) --region $(REGION))
	@aws ecr create-repository --profile $(PROFILE) --region $(REGION) --repository-name $(PROJECT) || :
	@aws iam attach-role-policy --role-name aws-elasticbeanstalk-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly --profile $(PROFILE) --region $(REGION)

########################
# Development commands #
########################

build-local:
	@echo "+\n++ Building local Docker image...\n+"
	@docker build -t $(PROJECT):development -f ./app/Dockerfile.local ./app/
	
run-local:
	@echo "+\n++ Running locally\n+"
	@docker-compose up

close-local:
	@echo "+\n++ Closing local container\n+"
	@docker-compose down

workspace:
	@docker exec -it $(PROJECT)-client bash

#################################
# Deployment build and commands #
#################################

deploy-prep-dev:
	@echo "+\n++ Creating Dockerrun.aws.json file...\n+"
	@cp .config/.env.dev .env
	@.build/build_dockerrun.sh > Dockerrun.aws.json

deploy-prep-staging:
	@echo "+\n++ Creating Dockerrun.aws.json file...\n+"
	@cp .config/.env.staging .env
	@.build/build_dockerrun.sh > Dockerrun.aws.json

deploy-build:
	@echo "+\n++ Performing build of Docker image...\n+"
	@echo "Tagging images with: $(ENVIRONMENT)"
	@docker build -t $(PROJECT):$(TAG) -f ./app/Dockerfile.$(ENVIRONMENT) ./app/

deploy-push:
	@echo "+\n++ Pushing image to registry...\n+"
	@docker tag $(PROJECT):$(TAG) $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(REPO):$(TAG)
	@docker login -u AWS -p $(shell aws ecr get-login-password --region $(REGION)) $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com
	@docker push $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(REPO):$(TAG)



deploy-version:
	@echo "+\n++ Deploying to Elasticbeanstalk...\n++"
	@zip -r $(call deployTag).zip Dockerrun.aws.json
	@aws --profile $(PROFILE) configure set region $(REGION)
	@aws --profile $(PROFILE) s3 cp $(call deployTag).zip s3://$(BUCKET_NAME)/$(PROJECT)/$(call deployTag).zip
	@aws --profile $(PROFILE) elasticbeanstalk create-application-version --application-name $(PROJECT) --version-label $(call deployTag) --source-bundle S3Bucket="$(BUCKET_NAME)",S3Key="$(PROJECT)/$(call deployTag).zip"
	@aws --profile $(PROFILE) elasticbeanstalk update-environment --application-name $(PROJECT) --environment-name $(PROJECT)-$(ENVIRONMENT) --version-label $(call deployTag)

healthcheck:
	@aws --profile $(PROFILE) elasticbeanstalk describe-environments --application-name $(PROJECT) --environment-name $(PROJECT)-$(ENVIRONMENT) --query 'Environments[*].{Status: Status, Health: Health}'


##################################
# Production Deployment Commands #
##################################

deploy-prep-prod:
	@echo "+\n++ Creating Dockerrun.aws.json file...\n+"
	@cp .config/.env.production .env
	@.build/build_dockerrun.sh > Dockerrun.aws.json

deploy-build-prod:
	@echo "+\n++ Performing build of Docker image...\n+"
	@echo "Tagging images with: $(ENVIRONMENT)"
	@docker build -t $(PROJECT):$(TAG) -f ./app/Dockerfile.$(ENVIRONMENT) ./app/

deploy-push-prod:
	@echo "+\n++ Pushing image to registry...\n+"
	@$(shell aws ecr get-login-password --no-include-email --profile $(PROFILE) --region $(REGION))
	@docker tag $(PROJECT):$(TAG) $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(TAG)
	@docker push $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(TAG)

deploy-version-prod:
	@echo "+\n++ Deploying to Elasticbeanstalk...\n++"
	@zip -r $(call deployTag).zip Dockerrun.aws.json
	@aws --profile $(PROFILE) configure set region $(REGION)
	@aws --profile $(PROFILE) s3 cp $(call deployTag).zip s3://$(BUCKET_NAME)/$(PROJECT)/$(call deployTag).zip
	@aws --profile $(PROFILE) elasticbeanstalk create-application-version --application-name "Google My Business Web" --version-label $(call deployTag) --source-bundle S3Bucket="$(BUCKET_NAME)",S3Key="$(PROJECT)/$(call deployTag).zip"
	@aws --profile $(PROFILE) elasticbeanstalk update-environment --application-name "Google My Business Web" --environment-name $(PROJECT)-$(ENVIRONMENT) --version-label $(call deployTag)


#############################
# Helper commands #
#############################

clean-up:
	@echo "+\n++ Cleaning up...\n+"
	@docker-compose down

# ------------------------------------------------------------------------------
# Test pipeline commands
# ------------------------------------------------------------------------------	

run-test:
	@echo "+\n++ Make: Running test build ...\n+"
	@docker-compose -f docker-compose.test.yml up -d

run-client-test:
	@docker exec -i $(PROJECT)-client npm run test:pipeline

close-test:
	@echo "+\n++ Make: Closing test container ...\n+"
	@docker-compose -f docker-compose.test.yml down