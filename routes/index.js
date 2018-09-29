const Router = require('koa-router')
const router = new Router()
// User routes
const users = require('./users')
router.use('/users', users.routes())
// Post routes
const posts = require('./posts')
router.use('/posts', posts.routes())

module.exports = router