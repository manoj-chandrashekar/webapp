#!/bin/bash

# Update the package list
sudo apt-get update

sudo apt-get upgrade -y

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Check node versions
node -v
npm -v

# Install MariaDB
sudo apt-get install -y mariadb-server

sudo systemctl enable mariadb
# Start the MariaDB service
sudo systemctl start mariadb

# printf "yes\nno\nno\nyes\nyes\nyes\nyes\n" | sudo mysql_secure_installation
password="NeuGr@d2022"
printf "%s\nno\nno\nyes\nyes\nyes\nyes\n" "$password" | sudo mysql_secure_installation -p$password

sudo mysql -u root -p$password

sudo mariadb -e "CREATE DATABASE webapp";
sudo mariadb -e "CREATE USER 'user1'@localhost IDENTIFIED BY 'password1'";
sudo mariadb -e "GRANT ALL PRIVILEGES ON *.* TO 'user1'@localhost IDENTIFIED BY 'password1'";
sudo mariadb -e "FLUSH PRIVILEGES";
sudo mariadb -e "exit";

sudo apt-get install -y unzip

cd /home/ec2-user
sudo mkdir webapp
sudo unzip webapp.zip -d wepapp
rm webapp.zip
cd webapp
mv users.csv /opt/
npm i
node app.js






