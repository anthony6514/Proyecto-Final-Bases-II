const endpoints = ['top-muertes', 'ecuador', 'comparativa-andina', 'letalidad', 'stats-region'];

async function check() {
    for (const ep of endpoints) {
        try {
            const r = await fetch(`http://localhost:3000/api/${ep}`);
            const data = await r.json();
            console.log(`Endpoint: ${ep}`);
            console.log(`- Length: ${data.length}`);
            if (data.length > 0) {
                console.log(`- Keys: ${Object.keys(data[0]).join(', ')}`);
                console.log(`- Data: ${JSON.stringify(data[0], null, 2)}`);
            }
            console.log('---');
        } catch (e) {
            console.error(`Error on ${ep}:`, e.message);
        }
    }
}

check();
