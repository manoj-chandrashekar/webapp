#!/bin/bash

# Update the package list
sudo apt-get update

sudo apt-get upgrade -y

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Check node versions
node -v
npm -v

# # Install MariaDB
# sudo apt-get install -y mariadb-server

# sudo systemctl enable mariadb
# # Start the MariaDB service
# sudo systemctl start mariadb

# password="NeuGr@d2022"
# printf "%s\nno\nno\nyes\nyes\nyes\nyes\n" "$password" | sudo mysql_secure_installation -p$password

# sudo mysql -u root -p$password

# sudo mariadb -e "CREATE DATABASE webapp";
# sudo mariadb -e "CREATE USER 'user1'@localhost IDENTIFIED BY 'password1'";
# sudo mariadb -e "GRANT ALL PRIVILEGES ON *.* TO 'user1'@localhost IDENTIFIED BY 'password1'";
# sudo mariadb -e "FLUSH PRIVILEGES";
# sudo mariadb -e "exit";

sudo apt-get install -y unzip

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /home/csye6225 -m csye6225

cd /home/csye6225/
pwd
sudo mkdir webapp
sudo cp /home/admin/webapp.zip /home/csye6225/
ls -al
sudo unzip webapp.zip -d webapp
sudo rm webapp.zip
sudo chown -R csye6225:csye6225 webapp
sudo chmod -R 755 webapp
cd webapp
sudo cp users.csv /home/csye6225/
sudo npm i

# cd /home/admin/
# pwd
# sudo mkdir webapp
# ls -al
# sudo unzip webapp.zip -d webapp
# sudo rm webapp.zip
# cd webapp
# sudo cp users.csv /home/admin/
# sudo npm i
sudo mv /home/admin/webapp.service /etc/systemd/system/webapp.service

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp
