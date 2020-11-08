require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const pokedex = require('./pokedex.json');
const { PORT, API_TOKEN, NODE_ENV } = require('./config');
const errorHandler = require('./error-handler');


const app = express();
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

const morganOption = (NODE_ENV === 'development')
                      ? 'common'
                      : 'tiny'
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
    if (!req.get('Authorization')) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    const bearerToken = req.get('Authorization').split(' ')[1];
    
   
    if ( bearerToken !==API_TOKEN) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    
    next();
});

app.use(errorHandler);

function handleGetTypes(req, res) {
    res.json(validTypes);
};

function handleGetPokemon(req, res) {
    let response = pokedex.pokemon
    
    
    if (req.query.name) {
        response = response.filter(pokemon =>
          // case insensitive searching
          pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
        )
      }
    
      // filter our pokemon by type if type query param is present
      if (req.query.type) {
        response = response.filter(pokemon =>
          pokemon.type.includes(req.query.type)
        )
      }
    
      res.json(response)
    
    
    
    
};

app.get('/', (req, res) => {
  res.send('Hello Pokemon!');
});

app.get('/pokemon', handleGetPokemon);

app.get('/types', handleGetTypes);




app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});

