const mongoose = require('mongoose');
const InviteCode = require('./models/InviteCode');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const code = 'TEST12';
        const newInvite = new InviteCode({ code });
        await newInvite.save();
        console.log('Invite Code Created:', code);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
