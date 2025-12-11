const mongoose = require('mongoose');
const InviteCode = require('./models/InviteCode');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const codes = await InviteCode.find({});
        console.log('INVITE CODES:', JSON.stringify(codes, null, 2));
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
