const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaqs = require('koa-qs')
const db = require('./models')
const router = require('./routes')

app = new Koa()
koaqs(app)

app
	.use(logger())
	.use(bodyParser())
	.use(router.routes())
  .use(router.allowedMethods());
  
db.sequelize.sync().then(() => {
  app.listen(3000)
})
