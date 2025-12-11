const fs = require('fs');

async function testSignup() {
    const inviteCode = fs.readFileSync('invite_code.txt', 'utf8').trim();
    const url = 'http://localhost:5000/api/auth/register';
    const body = {
        username: 'TestUserScript' + Math.floor(Math.random() * 1000),
        email: 'testscript' + Math.floor(Math.random() * 1000) + '@example.com',
        password: 'password123',
        inviteCode: inviteCode
    };

    console.log('Attempting signup with:', body);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        const text = await response.text();
        console.log('Response Body:', text);

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testSignup();
