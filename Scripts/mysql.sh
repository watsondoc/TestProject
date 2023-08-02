echo "Starting new mysql service..."
docker run -e MYSQL_ROOT_PASSWORD=pwd -e MYSQL_DATABASE=testproject -p 3306:3306 --name db-mysql -d mysql:5.7.8
