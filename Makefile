install:
	@echo Installing Serverless
	@npm install -g serverless
	@echo Installing NPM modules
	@npm install

secrets:
	@echo Getting secrets
	@aws s3 cp s3://$(S3_BUCKET)/$(SECRETS_FILE_NAME) - > $(SECRETS_FILE_NAME)

build:
	@echo Deploying Lambda
	@sls deploy --stage $(SERVICE_ENV)