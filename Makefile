


all:
	docker-compose -f ./docker-compose.yml up

re: fclean all

clean:

removeall:
	docker rm -f $$(docker ps -qa) ; docker rmi -f $$(docker images -qa)
fclean:
	docker-compose -f ./docker-compose.yml down --rmi all -v --remove-orphans
