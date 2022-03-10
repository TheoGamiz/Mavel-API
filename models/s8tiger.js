const database = require('../database');

const Devices = {};

// Get heros
Devices.getAll = async () => {
  const usersCollection = database.db.collection('s8_tiger');
  return await usersCollection.find().toArray();
};


module.exports = Devices;