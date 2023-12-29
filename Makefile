all:
	docker-compose -f ./docker-compose.yml up --build

dev: devclean
	docker-compose -f ./docker-compose.dev.yml up --build

re: fclean all

devclean:
	docker-compose -f ./docker-compose.dev.yml down --rmi all -v --remove-orphans

fclean:
	docker-compose -f ./docker-compose.yml down --rmi all -v --remove-orphans
