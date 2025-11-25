const mongoose = require('mongoose');
const InviteCode = require('./models/InviteCode');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        // Generate a random 6-character alphanumeric code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newInvite = new InviteCode({ code });
        await newInvite.save();
        console.log('\n==================================================');
        console.log('🎉 NEW INVITE CODE GENERATED: ' + code);
        console.log('==================================================\n');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
