const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const s8_tiger = require('../models/s8tiger');

const DeviceController = {};




//Get heros
DeviceController.gets8tigers = async (callback) => {
    return callback(await s8_tiger.getAll());
  };
  

  module.exports = DeviceController;
