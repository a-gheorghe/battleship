const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL)

// connect to SQL database
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully')
  })
  .catch((err)=> {
    console.log('Unable to connect to the database, error: ', err)
  })

// define models
const Game = sequelize.define('game', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  inProgress: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  playerTurn: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  winner: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

const Player = sequelize.define('player', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

const Board = sequelize.define('board', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

const Square = sequelize.define('square', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  locationRow: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  locationColumn: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  hitStatus: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

const Ship = sequelize.define('ship', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  size: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  locationRow: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  locationColumn: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});


Player.belongsTo(Game); // Player now has GameID
Player.hasOne(Board); // Board now has PlayerID

Game.hasMany(Player, { onDelete: 'CASCADE' }); // Player now has GameID
Game.hasMany(Board, { onDelete: 'CASCADE' }); // Board now has GameID

Board.belongsTo(Game); // Board now has GameID
Board.belongsTo(Player); // Board now has PlayerID
Board.hasMany(Square, { onDelete: 'CASCADE' }); //Square now has BoardID
Board.hasMany(Ship, { onDelete: 'CASCADE' }) // Ship now has BoardID

Square.belongsTo(Board); // Square now has BoardID
Square.belongsTo(Ship); // Square now has ShipID

Ship.hasMany(Square, { onDelete: 'CASCADE' }) // Square now has ShipID
Ship.belongsTo(Board); //Ship now has boardID




module.exports = {
  sequelize,
  Sequelize,
  Player,
  Game,
  Board,
  Ship,
  Square
};
