const restify = require('restify');

const database = require('./database');
const UserController = require('./controllers/user-controller');
const NotesController = require('./controllers/notes-controller');
const HeroController = require('./controllers/hero-controller');
const Users = require('./models/users');



require('dotenv').config();

const app = restify.createServer();

(async () => {
  await database.connect();

  app.use(restify.plugins.bodyParser());

  // Sign up
  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    UserController.signup(
      username,
      password,
      (statusCode, errorMessage, token) => {
        if (statusCode !== 200) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }
        return res.send(200, {
          error: null,
          token: token
        });
      }
    );
  });

  // Sign in
  app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    UserController.signin(
      username,
      password,
      (statusCode, errorMessage, token) => {
        if (statusCode !== 200) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }
        return res.send(200, {
          error: null,
          token: token
        });
      }
    );
  });

  //add Hero
  app.post('/addhero', (req, res) => {
    const { name, description } = req.body;

    HeroController.addhero(name, description, (statusCode, errorMessage) => {
      if (statusCode !== 200) {
        return res.send(statusCode, {
          error: errorMessage
        });
      }
      return res.send(200, {
        error: null
      });
    });
  });

  //get Heros
  app.get('/getheros', (req, res) => {
    

    HeroController.getheros((heros) => {
      
      return res.send(200, {
        error: null,
        heros: heros
      });
    });
  });



  //delete hero 
  app.del('/heros/:id', (req, res) => {
    
    const heroID = req.params.id;
    
    HeroController.deleteHero(heroID, (statusCode, errorMessage) => {
      if (statusCode !== 200) {
        return res.send(statusCode, {
          error: errorMessage
        });
      }
      return res.send(200, {
        error: null
       
      });
    });
  });



  // Patch hero
  app.patch('/hero/:id', (req, res) => {
    
    const heroID = req.params.id;
    const description = req.body.description;
    

    HeroController.modifyHero(
      heroID,
      description,
      
      (statusCode, errorMessage, hero) => {
        if (statusCode !== 200) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }
        return res.send(200, {
          error: null,
          note: hero
        });
      }
    );
  });

  // Patch note
  app.patch('/notes/:id', (req, res) => {
    const token = req.header('x-access-token');
    const noteID = req.params.id;
    const noteContent = req.body.content;

    NotesController.modifyNote(
      token,
      noteID,
      noteContent,
      (statusCode, errorMessage, note) => {
        if (statusCode !== 200) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }
        return res.send(200, {
          error: null,
          note: note
        });
      }
    );
  });

// Get notes
app.get('/notes', (req, res) => {
  const token = req.header('x-access-token');

  NotesController.getNotes(token, (statusCode, errorMessage, notes) => {
    if (statusCode !== 200) {
      return res.send(statusCode, {
        error: errorMessage
      });
    }
    return res.send(200, {
      error: null,
      notes: notes
    });
  });
});



   // Add note
   app.put('/notes', (req, res) => {
    const token = req.header('x-access-token');
    const noteContent = req.body.content || '';

    NotesController.addNote(
      token,
      noteContent,
      (statusCode, errorMessage, note) => {
        if (statusCode !== 200) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }
        return res.send(200, {
          error: null,
          note: note
        });
      }
    );
  });



  
  // Delete note
  app.del('/notes/:id', (req, res) => {
    const token = req.header('x-access-token');
    const noteID = req.params.id;

    NotesController.deleteNote(token, noteID, (statusCode, errorMessage) => {
      if (statusCode !== 200) {
        return res.send(statusCode, {
          error: errorMessage
        });
      }
      return res.send(200, {
        error: null
      });
    });
  });

  app.listen(process.env.PORT, function () {
    console.log(`App listening on PORT ${process.env.PORT}`);
  });
})();
