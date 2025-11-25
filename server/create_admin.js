const mongoose = require('mongoose');
const User = require('./models/User');
const InviteCode = require('./models/InviteCode');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');

        // 1. Create a special invite code for admin
        const adminInviteCode = 'ADMIN_SECRET';
        const invite = new InviteCode({ code: adminInviteCode });
        await invite.save();

        // 2. Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
            username: 'admin',
            password: hashedPassword,
            inviteCodeUsed: adminInviteCode
        });

        await adminUser.save();

        // Mark invite as used
        invite.isUsed = true;
        invite.usedBy = adminUser._id;
        await invite.save();

        console.log('Admin User Created: admin / admin123');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
