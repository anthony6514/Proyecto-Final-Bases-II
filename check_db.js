
const { MongoClient } = require('mongodb');

async function check() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('covid_db');
        const doc = await db.collection('stats').findOne({});
        console.log('Sample document from stats:');
        console.log(JSON.stringify(doc, null, 2));

        const ecuador = await db.collection('stats').findOne({ Country: 'Ecuador' });
        console.log('Ecuador document:');
        console.log(JSON.stringify(ecuador, null, 2));

        const regions = await db.collection('regiones_info').find().toArray();
        console.log('Regiones info:');
        console.log(JSON.stringify(regions, null, 2));
    } finally {
        await client.close();
    }
}

check();
