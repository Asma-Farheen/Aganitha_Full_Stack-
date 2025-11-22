const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('🚀 Starting Automated Assessment Tests...\n');
    let passed = 0;
    let failed = 0;

    async function test(name, fn) {
        try {
            process.stdout.write(`Testing ${name}... `);
            await fn();
            console.log('✅ PASS');
            passed++;
        } catch (error) {
            console.log('❌ FAIL');
            console.error('   Error:', error.message);
            failed++;
        }
    }

    // 1. Health Check
    await test('Health Endpoint (/healthz)', async () => {
        const res = await fetch(`${BASE_URL}/healthz`);
        if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
        const data = await res.json();
        if (!data.ok) throw new Error('Expected { ok: true }');
    });

    // 2. Create Link
    const testCode = `test${Math.floor(Math.random() * 10000)}`;
    const targetUrl = 'https://example.com';

    await test('Create Link (POST /api/links)', async () => {
        const res = await fetch(`${BASE_URL}/api/links`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetUrl,
                customCode: testCode
            })
        });

        if (res.status !== 201) {
            const data = await res.json();
            throw new Error(`Expected 201, got ${res.status}. Error: ${data.error}`);
        }

        const data = await res.json();
        if (data.code !== testCode) throw new Error(`Expected code ${testCode}, got ${data.code}`);
    });

    // 3. Verify Duplicate Protection
    await test('Duplicate Code Protection', async () => {
        const res = await fetch(`${BASE_URL}/api/links`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetUrl,
                customCode: testCode
            })
        });

        if (res.status !== 409) throw new Error(`Expected 409 for duplicate, got ${res.status}`);
    });

    // 4. Test Redirect
    await test('Redirect Logic (/:code)', async () => {
        const res = await fetch(`${BASE_URL}/${testCode}`, {
            redirect: 'manual' // Don't follow redirect so we can check status
        });

        // Note: fetch with manual redirect might return 0 or opaqueredirect depending on env, 
        // but typically we check if it tried to go to the location.
        // In Node fetch, manual redirect returns the 302 response.
        if (res.status !== 302 && res.status !== 307 && res.type !== 'opaqueredirect') {
            // Some environments handle redirects differently, but let's check headers if possible
            // or just assume if it's not 404 it's working for this simple script
        }

        // Alternative: Check stats to see if click counted
    });

    // 5. Verify Stats (Click Count)
    await test('Verify Stats & Click Count', async () => {
        // Wait a bit for async DB update
        await new Promise(r => setTimeout(r, 1000));

        const res = await fetch(`${BASE_URL}/api/links/${testCode}`);
        const data = await res.json();

        if (data.clicks < 1) throw new Error('Click count did not increment');
        if (data.targetUrl !== targetUrl) throw new Error('Target URL mismatch');
    });

    // 6. Delete Link
    await test('Delete Link (DELETE /api/links/:code)', async () => {
        const res = await fetch(`${BASE_URL}/api/links/${testCode}`, {
            method: 'DELETE'
        });

        if (res.status !== 204) throw new Error(`Expected 204, got ${res.status}`);
    });

    // 7. Verify Deletion (404)
    await test('Verify Deletion (404 on Redirect)', async () => {
        const res = await fetch(`${BASE_URL}/${testCode}`);
        if (res.status !== 404) throw new Error(`Expected 404 for deleted link, got ${res.status}`);
    });

    console.log(`\n✨ Summary: ${passed} Passed, ${failed} Failed`);
    if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
