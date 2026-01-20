const mongoose = require('mongoose');
const config = require('./environment');

const connectDB = async () => {
  try {
    // Add special options for problematic networks
    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
      maxPoolSize: 10,
      minPoolSize: 5,
      // Add these for DNS issues
      directConnection: false,
      ssl: true,
      retryWrites: true,
      w: 'majority',
    };

    const conn = await mongoose.connect(config.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName,
    });
    
    // Don't exit, allow server to continue (will retry on next request)
    console.warn('⚠️  Continuing without MongoDB. Some features may not work.');
    return null;
  }
};

module.exports = connectDB;