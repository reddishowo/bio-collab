import dns from 'node:dns';
import { MongoClient, type MongoClientOptions } from 'mongodb';

const options: MongoClientOptions = {};
const dnsServer = process.env.MONGODB_DNS_SERVER?.trim();

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

function createClientPromise(uri: string) {
  const client = new MongoClient(uri, options);

  return client.connect().catch((error) => {
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientPromise = undefined;
    }

    throw error;
  });
}

export function getMongoClient() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Add it to .env.local.');
  }

  if (uri.startsWith('mongodb+srv://') && dnsServer) {
    dns.setServers([dnsServer]);
  }

  if (process.env.NODE_ENV !== 'development') {
    clientPromise ??= createClientPromise(uri);
    return clientPromise;
  }

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise(uri);
  }

  return global._mongoClientPromise;
}

export default getMongoClient;
