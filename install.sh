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

password="NeuGr@d2022"
printf "%s\nno\nno\nyes\nyes\nyes\nyes\n" "$password" | sudo mysql_secure_installation -p$password

sudo mysql -u root -p$password

sudo mariadb -e "CREATE DATABASE webapp";
sudo mariadb -e "CREATE USER 'user1'@localhost IDENTIFIED BY 'password1'";
sudo mariadb -e "GRANT ALL PRIVILEGES ON *.* TO 'user1'@localhost IDENTIFIED BY 'password1'";
sudo mariadb -e "FLUSH PRIVILEGES";
sudo mariadb -e "exit";

sudo apt-get install -y unzip

cd /home/admin/
pwd
sudo mkdir webapp
ls -al
sudo unzip webapp.zip -d webapp
sudo rm webapp.zip
cd webapp
sudo cp users.csv /home/admin/
sudo npm i
# sudo mv /home/admin/application.service /etc/systemd/system/application.service
sudo sh -c "echo '[Unit]
Description=My NPM Service
After=network.target

[Service]
User=admin
WorkingDirectory=/home/admin/webapp
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target' | sudo tee /etc/systemd/system/webapp.service"

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp
