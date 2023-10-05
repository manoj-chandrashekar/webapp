#!/bin/bash

# Update the package list
sudo apt-get update

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Check node versions
node -v
npm -v

# Install MariaDB
sudo apt-get install -y mariadb-server

# Start the MariaDB service
sudo systemctl start mariadb

# Secure the MariaDB installation
sudo mysql_secure_installation

