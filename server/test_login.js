// const fetch = require('node-fetch'); // Built-in fetch used

async function testLogin() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'testuser3', password: 'password123' })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        if (response.ok) {
            console.log('Token:', data.token);
        } else {
            console.log('Error:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testLogin();
