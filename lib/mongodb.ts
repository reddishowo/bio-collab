import dns from 'node:dns';
import { MongoClient, type MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};
const dnsServer = process.env.MONGODB_DNS_SERVER?.trim();

if (uri.startsWith('mongodb+srv://') && dnsServer) {
  dns.setServers([dnsServer]);
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

function createClientPromise() {
  const client = new MongoClient(uri, options);

  return client.connect().catch((error) => {
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientPromise = undefined;
    }

    throw error;
  });
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = createClientPromise();
}

export default clientPromise;
