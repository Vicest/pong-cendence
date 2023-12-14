all:
	docker-compose -f ./docker-compose.yml up

re: fclean all

clean:

seed:
	docker cp scripts/init.sql $$(docker-compose ps -q postgres):/init.sql ; docker exec -i $$(docker-compose ps -q postgres) pg_restore --clean -U $$POSTGRES_USER -d $$POSTGRES_DB init.sql

removeall:
	docker rm -f $$(docker ps -qa) ; docker rmi -f $$(docker images -qa)
fclean:
	docker-compose -f ./docker-compose.yml down --rmi all -v --remove-orphans
