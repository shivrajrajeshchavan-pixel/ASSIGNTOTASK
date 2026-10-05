const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb://shivrajrajeshchavan_db_user:XN4VU0EANluqpUHS@ac-5zaur2a-shard-00-00.tqdxmlq.mongodb.net:27017,ac-5zaur2a-shard-00-01.tqdxmlq.mongodb.net:27017,ac-5zaur2a-shard-00-02.tqdxmlq.mongodb.net:27017/attendotask?ssl=true&replicaSet=atlas-salzho-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Successfully connected and pinged using direct URI!');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
