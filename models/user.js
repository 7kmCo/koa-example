const util = require('util');
const db = require('../models/database');

const dbQuery = util.promisify(db.query);

module.exports = {
  findAll: async () => {
    let result = await dbQuery('SELECT * FROM users');
    return result.rows.length ? result.rows : [];
  },
  findById: async id => {
    let result = await dbQuery('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
  },
  findOne: async username => {
    let result = await dbQuery('SELECT * FROM users WHERE email = $1', [username]);
    return result.rows.length ? result.rows[0] : null;
  },
  create: async newUser => {
    let result = await dbQuery('INSERT INTO users(firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [newUser.firstName, newUser.lastName, newUser.email, newUser.password]);
    return result.rows.length ? result.rows[0] : null;
  },
  update: async (id, user) => {
    let result = await dbQuery('UPDATE users SET (firstname, lastname, email) = ($1, $2, $3) WHERE email = $4', [user.firstName, user.lastName, user.email, id]);
    return result.rows.length ? result.rows[0] : null;
  },
  deleteById: async id => {
    await dbQuery('DELETE FROM users WHERE id = $1', [id]);
  },
};
