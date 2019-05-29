const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '',
  database: 'koa-passport-example',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}