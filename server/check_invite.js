const mongoose = require('mongoose');
const InviteCode = require('./models/InviteCode');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const codeStr = fs.readFileSync('invite_code.txt', 'utf8').trim();
        const code = await InviteCode.findOne({ code: codeStr });
        if (code) {
            console.log(`Code ${codeStr} found. Is Used: ${code.isUsed}`);
        } else {
            console.log(`Code ${codeStr} NOT FOUND`);
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
