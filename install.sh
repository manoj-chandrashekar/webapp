#!/bin/bash

# Update the package list
sudo apt-get update

sudo apt-get upgrade -y

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Check node versions
node -v
npm -v

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
sudo chown -R csye6225:csye6225 /etc/environment
sudo chmod -R 755 webapp
cd webapp
sudo cp users.csv /home/csye6225/
sudo npm i

sudo mv /home/admin/webapp.service /etc/systemd/system/webapp.service

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp
