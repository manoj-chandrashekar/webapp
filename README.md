# My Web Application
This is a web backend application built using NodeJS and npm.

## Prerequisites
Before you can build and deploy the application, you will need to have the following software installed on your local machine:

 - Node.js
 - npm
 - MySQL

## Build Instructions
To build the application, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the project dependencies.jvj
4. Create a MySQL database called `webapp` for the application.
5. Update the username and password variables in database.js to match your MySQL credentials.
6. Run `npm start` to build and run the application.
7. Check the endpoints in Postman

## Deployment in VM
 - Download the zipfile from canvas
 - Connect to Server using 
    - `ssh -i ~/.ssh/digitalocean root@ipaddress`
 - SCP the zip to the required path as below. First navigate to the folder containing zip.
    - `scp -i .ssh/digitalocean webapp.zip root@ipaddress:/opt`
 - Install dependency to unzip the file and unzip it
    - `sudo apt-get install unzip`
    - `unzip webapp.zip`
 - Navigate to the project folder and run the shell script
    - `sh install.sh`
 - Run the command to connect to mariaDB and create a database
    - `mysql -u root -p` and enter password when prompted
    - `create database webapp`
 - Setup node packages and run the application
    - `npm install`
    - `node app.js`
 - Test out the apis in Postman


If you want to deploy the application to a production server, you will need to follow additional steps to configure the server and deploy the application. These steps will depend on your server environment and deployment strategy.

### Author
 - **Name:** Manoj Chandrasekaran
 - **NUID:** 002767647
