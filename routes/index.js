const Router = require('koa-router')
const router = new Router()

const users = require('./users')

router.use('/users', users.routes())

module.exports = router