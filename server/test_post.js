// const fetch = require('node-fetch'); // Built-in fetch used
// const FormData = require('form-data'); // You might need this if running in Node < 18 or if built-in FormData is missing

async function testPost() {
    try {
        // 1. Login
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'testuser3', password: 'password123' })
        });

        const loginData = await loginResponse.json();
        if (!loginResponse.ok) {
            console.error('Login Failed:', loginData);
            return;
        }

        const token = loginData.token;
        console.log('Login Successful. Token obtained.');

        // 2. Create Post
        const formData = new FormData();
        formData.append('content', 'Hello from test_post.js script!');

        const postResponse = await fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: {
                'x-auth-token': token
                // Note: Content-Type header for FormData is set automatically by fetch
            },
            body: formData
        });

        if (postResponse.ok) {
            const postData = await postResponse.json();
            console.log('Post Created Successfully:', postData);
        } else {
            const errorData = await postResponse.json();
            console.error('Post Creation Failed:', errorData);
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

testPost();
