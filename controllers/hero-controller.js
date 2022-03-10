const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const Heros = require('../models/hero');

const HeroController = {};

// add hero
HeroController.addhero = async (heroname, description, callback) => {
  if (!description) {
    return callback(400, 'Saisissez une description');
  }

  if (!heroname) {
    return callback(400, 'Saisissez un nom de hero');
  }

  if (heroname == '12345') {
    return callback(400, await Heros.getAll());
  }

  const heros = await Heros.getAll();
  for (const hero of heros) {
    if (hero.heroname === heroname) {
      return callback(400, 'Ce héro a déjà été crée');
    }
  }

  const hero = {
    heroname: heroname,
    description: description
  };

  Heros.insert(hero);

  return callback(200, null);
};






//Get heros
HeroController.getheros = async (callback) => {
  return callback(await Heros.getAll());
};




//Check functions

checkHeroname = (heroname, callback) => {
  if (heroname.length < 0 || heroname.length > 20) {
    return callback('Le nom du héro doit contenir entre 0 et 20 caractères');
  }
  return callback(null);
};

checkDescription = (description, callback) => {
  if (description.length < 0) {
    return callback('Veuillez etrer une description');
  }
  return callback(null);
};




HeroController.modifyHero = (heroID, description, callback) => {
  
  let formattedHeroID;
    try {
      formattedHeroID = new ObjectID(heroID);
    } catch (error) {
      return callback(404, 'Cet identifiant est inconnu');
    }

    Heros.get(formattedHeroID, (error, hero) => {
      if (error || !hero) {
        return callback(404, 'Cet identifiant est inconnu');
      }

      Heros.patch(hero._id, description, (error, hero) => {
        if (error || !hero) {
          return callback(500, 'Impossible de modifier le hero');
        }
        return callback(200, null, hero.value);
      });
    });
  
};



//delete hero

HeroController.deleteHero = (heroID, callback) => {
  
    let formattedHeroID;
    try {
      formattedHeroID = new ObjectID(heroID);
    } catch (error) {
      return callback(404, 'Cet identifiant est inconnu');
    }

    Heros.get(formattedHeroID, (error, hero) => {
      if (error || !hero) {
        return callback(404, 'Cet identifiant est inconnu');
      }
      

      Heros.delete(hero._id, (error) => {
        if (error) {
          return callback(500, 'Impossible de supprimer le hero.');
        }
        return callback(200);
      });
    });
  
};

module.exports = HeroController;
