const { Pool } = require('pg')

const pool = new Pool() //pool takes default configurations from env variables

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res && res.rowCount || res })
      callback(err, res)
    })
  },
}