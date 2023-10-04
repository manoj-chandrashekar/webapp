const bcrypt = require('bcrypt');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const Account = require('../models/account');

const processCsv = async() => {
    //update file path for local run and vm run
    const filePath = 'users.csv' //path.join('/', 'opt', 'users.csv');
    const csvData = [];
    console.log('Current working directory:', process.cwd());

    fs.createReadStream(filePath) 
        .pipe(csv())
        .on('data', (row) => {
            csvData.push(row);
    })
    .on('end', async() => {
        for(const userData of csvData) {
            const existingAccount = await Account.findOne({
                where: { email: userData.email },
            });

            if(!existingAccount) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                await Account.create({
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    password: hashedPassword,
                });
            }
        }

        console.log('User accounts created');
    });
};

module.exports = processCsv;