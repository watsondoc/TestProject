## Getting Started

### Preparation

* Make sure https://jsonplaceholder.typicode.com is available for you
* Go to Script folder and run sh script, it will start MySql docker container with proper settings

### Api
* Navigate to Api folder and run npm install
* To start api: npm run start

It will start api service on localhost:4000

### Web
* Navigate to Web folder and run npm install
* To start web app: npm run start

It will start web service on localhost:3000

### Using
Navigate to localhost:3000 in your browser

### other notes
You can try to break the application via text filter, because there is no protection from sql injections, but I keep it in mind 
Also you can try to break pagination by deleting entities from Posts table, but it looks not critical

