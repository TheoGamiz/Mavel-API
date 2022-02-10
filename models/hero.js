const database = require('../database');

const Heros = {};

// Get heros
Heros.getAll = async () => {
  const usersCollection = database.db.collection('heros');
  return await usersCollection.find().toArray();
};


//gethero
Heros.get = (heroID, callback) => {
  const herosCollection = database.db.collection('heros');

  herosCollection
    .find({
      _id: heroID
    })
    .sort({
      createdAt: -1
    })
    .toArray((error, heros) => {
      return callback(error, heros[0]);
    });
};


//Patch Hero
Heros.patch = (heroID, description, callback) => {
  const herosCollection = database.db.collection('heros');

  herosCollection.findOneAndUpdate(
    {
      _id: heroID
    },
    {
      $set: {
        description: description,
        lastUpdatedAt: new Date()
      }
    },
    {
      returnOriginal: false
    },
    callback
  );
};

// Insert user
Heros.insert = (hero) => {
  const herosCollection = database.db.collection('heros');
  herosCollection.insertOne(hero);
};


//delete hero

Heros.delete = (HeroID, callback) => {
  const herosCollection = database.db.collection('heros');

  herosCollection.deleteOne(
    {
      _id: HeroID
    },
    callback
  );
};



module.exports = Heros;
