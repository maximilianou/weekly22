
create-ui:
	npx create-react-app ui --template typescript	
run-ui:
	cd ui && npm run start
api-create:
	mkdir api && cd api && npm -y init
	cd api && npm i express-openapi-validator	
	cd api && npm i @types/node typescript 
	cd api && npm install ts-node -D
	cd api &&  ./node_modules/.bin/tsc --init --rootDir src --outDir ./bin --esModuleInterop --lib ES2019 --module es2020 --noImplicitAny true
	cd api && mkdir src
	cd api && echo "console.log('Running.. TypeScript app')" > src/app.ts
	cd api && ./node_modules/.bin/tsc
	cd api && node ./bin/app.js
	cd api && npm i express @types/express
	cd api && npm i connect express-openapi-validator swagger-routes-express validator yamljs @types/validator @types/yamljs
	cd api && npm i swagger-ui-express
	cd api && npm i -D @types/swagger-ui-express
	cd api && npm i tsconfig-paths
	
ghcr:
	docker login ghcr.io --username maximilianou #cat ~/personal_full.github
ghcr-curl:
	docker pull appropriate/curl:latest 
ghcr-push:
	docker tag appropriate/curl:latest ghcr.io/maximilianou/curl:latest
	docker push ghcr.io/maximilianou/curl:latest
ghcr-pull:
	docker pull ghcr.io/maximilianou/curl:latest # public image

deploy:
	docker-compose -f docker-compose.yml up -d
undeploy:
	docker-compose -f docker-compose.yml down

#deploy-aws:
#	docker compose --context myecscontext -f docker-compose.yml up
#undeploy-aws:
#	docker compose --context myecscontext -f docker-compose.yml down


