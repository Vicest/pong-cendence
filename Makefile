all:
	sudo docker-compose -f ./docker-compose.yml up

re: fclean all

clean:

removeall:
	sudo docker rm -f $$(sudo docker ps -qa) ; sudo docker rmi -f $$(sudo docker images -qa)
fclean:
	docker-compose -f ./docker-compose.yml down --rmi all -v --remove-orphans
