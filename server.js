const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const { Game, Board, Player, Square, Ship, Sequelize } = require('./models');
const sequelize = new Sequelize(process.env.DATABASE_URL)
const hbs = require('express-handlebars')({ extname: '.hbs' });

app.engine('hbs', hbs);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({ secret: 'secretAna' }))

// ROUTES

// Homepage
app.get('/', (req,res) => {
  res.render('home');
});

// Play battleship button
app.post('/newGame', (req, res) => {
  // check Player table to see if there are any games with one player
  // if that array.length === 0, then create new game
  // else set req.session.gameId = array[0].gameId
  var q = 'SELECT "gameId" FROM (SELECT "gameId", COUNT("gameId") FROM Players GROUP BY "gameId") as a WHERE count = 1;'
  sequelize.query(q, { model: Player })
  .then(players => {
    console.log('PLAYERS', players)
    if (players.length === 0){
      Game.create({ inProgress: true })
      .then(game => {
        req.session.gameId = game.dataValues.id
        console.log('actually in here', req.session)
        res.render('player', { gameId: req.session.gameId, session: req.session });
      });
    } else {
      req.session.gameId = players[0].dataValues.gameId
      console.log('in here', req.session)
      res.render('player', { gameId: req.session.gameId, session: req.session })
    }
  })
});

// add player1 to game
app.post('/newPlayerOne', (req, res) => {
  Player.create({ gameId: req.session.gameId })
  .then(player => {
    req.session.playerOneId = player.dataValues.id;
    res.json( { redirect: '/boardOne', player1Id: req.session.playerOneId, gameId: req.session.gameId });
  });
});

// add player2 to game
app.post('/newPlayerTwo', (req, res) => {
  Player.create({ gameId: req.session.gameId })
  .then(player => {
    req.session.playerTwoId = player.dataValues.id;
    res.json( { redirect: '/boardTwo', playerTwoId: req.session.playerTwoId, gameId: req.session.gameId });
  });
});

app.get('/boardOne', (req, res) => {
  console.log('here')
  Board.create({ gameId: req.session.gameId, playerId: req.session.playerOneId })
  .then(board => {
    req.session.boardOneId = board.dataValues.id

    var height = 10;
    var width = 10;
    var grid = []
    var promises = []

    for (var y = 0; y < height; y++){
      grid.push([])
      for (var x = 0; x < width; x++){
        var square = Square.create( { boardId: req.session.boardOneId, hitStatus: false, locationRow: x, locationColumn: y })
        grid[y].push(square)
      }
      promises.push(Promise.all(grid[y]))
    }

    Promise.all(promises).then((result) => {
      req.session.grid = result;
      console.log('req grid', req.session.grid)
      res.render('board', {grid: req.session.grid, playerOneId: req.session.playerOneId, playerTwoId: req.session.playerTwoId, gameId: req.session.gameId })
    })

    // Promise.all(grid)
    // .then((result) => {
    //   var count = 0, temp = [];
    //   req.session.grid = result.reduce((arr1, square) => {
    //     if (count < 10) {
    //       temp.push(square);
    //       count++;
    //     } else {
    //       count = 0;
    //       arr1.push(temp);
    //       temp = [];
    //     }
    //
    //     return arr1;
    //   }, [])
    //   console.log('req grid', req.session.grid)
    //   res.render('board', {grid: req.session.grid, playerOneId: req.session.playerOneId, playerTwoId: req.session.playerTwoId, gameId: req.session.gameId })
    // })
  })
});

app.get('/boardTwo', (req, res) => {
  console.log('hi');
  Board.create({ gameId: req.session.gameId, playerId: req.session.playerOneId })
  .then(board => {
    req.session.boardOneId = board.dataValues.id

    var height = 10;
    var width = 10;
    var grid = []

    for (var y = 0; y < height; y++){
      grid.push([])
      for (var x = 0; x < width; x++){
        var square = Square.create( { boardId: req.session.boardOneId, hitStatus: false, locationRow: x, locationColumn: y })
          grid[y].push(square)
      }
    }
    req.session.grid = grid
  })
  console.log('req grid', req.session.grid)
  res.render('board', {grid: req.session.grid, playerOneId: req.session.playerOneId, playerTwoId: req.session.playerTwoId, gameId: req.session.gameId })
});
// find all players in game
// SQL Query: count

// app.get('/findGamePlayers', (req, res) => {
//   console.log('finding players', req.session.gameId)
//   Player.findAll({
//     group: ['id', 'gameId']
//   })
//   .then(resp => {
//     res.json(resp);
//   })
//   .catch(err => console.log(err)
// });

app.get('/findGamePlayers', (req, res) => {
  console.log("HELLO I AM HERE")
  console.log('req.session', req.session.gameId)

  var q = `SELECT "id" FROM Players WHERE "gameId" = ${req.session.gameId}`

  sequelize.query(q, { model: Player })
  .then(players => {
    console.log('players array?', players)
    res.json({ players: players })
  })
})

app.get('/boardOneStatus', (req, res) => {
  // every 5 seconds,
})





// Place a ship on the board

// res.render will automatically look in the views folder for the file named after the render call
app.get('/allBoards', (req, res) => {

});

app.get('/placeShip', (req, res) => {

});

// Create a random board with ships already placed
app.get('/randomBoard', (req, res) => {

})



app.listen(3000, () => console.log('Example app listening on port 3000!'))
