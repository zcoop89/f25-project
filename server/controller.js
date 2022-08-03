const { CONNECTION_STRING } = process.env;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  // GET
  getPlayers: (req, res) => {
    sequelize
      .query(`SELECT * FROM players`)
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  // UPDATE -- PUT
  choosePlayer(req, res) {
    const {  } = req.body;
    sequelize.query();
  },

  // DELETE
  deletePlayer(req, res) {
    sequelize.query();
  },

  seed: (req, res) => {
    sequelize
      .query(
        `
      drop table if exists players;
      drop table if exists positions;
      
      create table positions (
        position_id serial primary key,
        name varchar(100)
      );
      
      create table players (
        player_id serial primary key,
        position_id integer references positions(position_id),
        name varchar(100),
        ppg float,
        is_selected boolean
      );

      insert into positions (name)
      values ('PG'),
      ('SG'),
      ('SF'),
      ('PF'),
      ('C');

      insert into players (name, ppg, is_selected, position_id)
      values ('Magic Johnson', 19.5, false, 1),
      ('Steph Curry', 24.3, false, 1),
      ('John Stockton', 13.4, false, 1),
      ('Isiah Thomas', 19.2, false, 1),
      ('Oscar Robertson', 25.5, false, 1),
      ('Michael Jordan', 30.1, false, 2),
      ('Kobe Bryant', 25.5, false, 2),
      ('Dwanye Wade', 22.1, false, 2),
      ('James Harden', 24.9, false, 2),
      ('Allen Iverson', 26.7, false, 2),
      ('LeGOAT KING James', 27.1, false, 3),
      ('Larry Bird', 24.3, false, 3),
      ('Kevin Durant', 27.2, false, 3),
      ('Scottie Pippen', 16.1, false, 3),
      ('Kawhi Leonard', 19.2, false, 3),
      ('Tim Duncan', 19.1, false, 4),
      ('Kevin Garnett', 17.8, false, 4),
      ('Dirk Nowitzki', 20.7, false, 4),
      ('Karl Malone', 25.0, false, 4),
      ('Giannis Antetokounmpo', 21.8, false, 4),
      ('Kareem Abdul-Jabbar', 24.6, false, 5),
      ('Shaquille O'' Neal', 23.7, false, 5),
      ('Wilt Chamberlain', 30.1, false, 5),
      ('Hakeem Olajuwon', 21.8, false, 5),
      ('Bill Russell', 15.1, false, 5)
    `
      )
      .then(() => {
        console.log("DB seeded!");
        res.sendStatus(200);
      })
      .catch((err) => console.log("error seeding DB", err));
  },
};

// GET ALL PLAYERS
// SELECT positions.position_id, players.player_id, players.name, players.ppg as PPG, players.is_selected as is_selected, positions.name as position_name from players
// inner join positions on positions.position_id = players.position_id

// GET TEAM MEMBERS
// select * from players
// where is_selected = false
