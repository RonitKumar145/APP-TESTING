const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const user = await User.findOne({ username: 'TestUser5' });
        if (user) {
            console.log('USER FOUND: ' + user.username);
        } else {
            console.log('USER NOT FOUND');
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
