const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('Mongodb Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
