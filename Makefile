


all:
	@sudo docker-compose -f ./docker-compose.yml up

re: fclean re

clean:

fclean:
	sudo docker-compose -f ./docker-compose.yml down --rmi all -v --remove-orphans
