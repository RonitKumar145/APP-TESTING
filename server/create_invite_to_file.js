const mongoose = require('mongoose');
const InviteCode = require('./models/InviteCode');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newInvite = new InviteCode({ code });
        await newInvite.save();
        fs.writeFileSync('invite_code.txt', code);
        console.log('Code saved to invite_code.txt');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
