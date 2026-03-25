
const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://anthonyruiz20048:1754511275@clusternorthwind.fy4x9vb.mongodb.net/covid_db?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('covid_db');
        const stats = database.collection('stats');

        const doc = await stats.findOne();
        console.log('Sample Document from stats:');
        console.log(JSON.stringify(doc, null, 2));

    } finally {
        await client.close();
    }
}

main().catch(console.error);
