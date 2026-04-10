const mongoose = require('mongoose');

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set.');
  }

  cachedConnection = mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'todoDB'
  });

  return cachedConnection;
}

module.exports = { connectToDatabase };
