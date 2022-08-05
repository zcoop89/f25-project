const { CONNECTION_STRING } = process.env;

const { query } = require("express");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

/// This is our get all players query with an INNER join that we can reuse in a few places
// to keep from having to keep typing this large query out
const getAllPlayers = `
  SELECT players.*, positions.position_id, positions.name as position_name FROM players
  INNER JOIN positions
  ON positions.position_id = players.position_id
  ORDER BY players.last_name ASC
`;

module.exports = {
  // simple get all players query, returns all players
  getPlayers: (req, res) => {
    sequelize
      .query(getAllPlayers)
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  // when a person chooses a player or clicks their player button this gets called
  choosePlayer: (req, res) => {
    const { player } = req.body;
    const { position_id, is_selected, player_id } = player;
    //if player is already selected, toggle off player
    if (is_selected) {
      sequelize
        // This query sets is_selected = false for the player we have chosen if they have already been selected
        .query(
          `
          UPDATE players
          SET is_selected = false
          WHERE players.player_id = ${player_id}
        `
        )
        // once that query runs, we need to return all players to get updated data
        .then(() => {
          sequelize
            .query(getAllPlayers)
            .then((dbRes) => res.status(200).send(dbRes[0]))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
      // if a player is not selected, then remove is_selected from all other players with same position id, and select selected player
    } else {
      sequelize
        // set is_selected to false, if position_id is same as selected person
        .query(
          `
          UPDATE players
          SET is_selected = false
          WHERE players.position_id = ${position_id}
        `
        )
        // we then update the person we chose
        .then(() => {
          sequelize
            .query(
              `
          UPDATE players
          SET is_selected = true
          WHERE players.player_id = ${player_id}
        `
            )
            // then we send back all players once they have been updated
            .then(() => {
              sequelize
                .query(getAllPlayers)
                .then((dbRes) => res.status(200).send(dbRes[0]))
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.error(err));
    }
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
        first_name varchar(100),
        last_name varchar(100),
        display_name varchar(100),
        position_id integer references positions(position_id),
        ppg float,
        is_selected boolean
      );
      insert into positions (name)
      values ('PG'),
      ('SG'),
      ('SF'),
      ('PF'),
      ('C');
      insert into players (first_name, last_name, display_name, ppg, is_selected, position_id)
      values ('Magic', 'Johnson', 'Magic Johnson', 19.5, false, 1),
      ('Steph', 'Curry', 'Steph Curry', 24.3, true, 1),
      ('John', 'Stockton', 'John Stockton', 13.4, false, 1),
      ('Isiah', 'Thomas', 'Isiah Thomas', 19.2, false, 1),
      ('Oscar', 'Robertson', 'Oscar Robertson', 25.5, false, 1),
      ('Michael', 'Jordan', 'Michael Jordan', 30.1, false, 2),
      ('Kobe', 'Bryant', 'Kobe Bryant', 25.5, false, 2),
      ('Dwayne', 'Wade', 'Dwanye Wade', 22.1, true, 2),
      ('James', 'Harden', 'James Harden', 24.9, false, 2),
      ('Allen', 'Iverson', 'Allen Iverson', 26.7, false, 2),
      ('Lebron', 'James', 'Lebron James', 27.1, false, 3),
      ('Larry', 'Bird', 'Larry Bird', 24.3, false, 3),
      ('Kevin', 'Durant', 'Kevin Durant', 27.2, false, 3),
      ('Scottie', 'Pippen', 'Scottie Pippen', 16.1, false, 3),
      ('Kawhi', 'Leonard', 'Kawhi Leonard', 19.2, false, 3),
      ('Tim', 'Duncan', 'Tim Duncan', 19.1, true, 4),
      ('Kevin', 'Garnett', 'Kevin Garnett', 17.8, false, 4),
      ('Dirk', 'Nowitzki', 'Dirk Nowitzki', 20.7, false, 4),
      ('Karl', 'Malone', 'Karl Malone', 25.0, false, 4),
      ('Giannis', 'Antetokounmpo', 'Giannis Antetokounmpo', 21.8, false, 4),
      ('Kareem', 'Abdul-Jabbar', 'Kareem Abdul-Jabbar', 24.6, true, 5),
      ('Shaquille', 'O''Neal', 'Shaquille O'' Neal', 23.7, false, 5),
      ('Wilt', 'Chamberlain', 'Wilt Chamberlain', 30.1, false, 5),
      ('Hakeem', 'Olajuwon', 'Hakeem Olajuwon', 21.8, false, 5),
      ('Bill', 'Russell', 'Bill Russell', 15.1, false, 5)
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
