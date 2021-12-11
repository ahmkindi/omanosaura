dev:
	docker-compose up -d

stop:
	docker-compose down

deploy:
	docker-compose -f docker-compose.prod.yml up
