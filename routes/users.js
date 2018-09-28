const Router = require('koa-router')
const router = new Router()
const db = require('../models')

// User routes

 /**
	* Get all users.
	*
	* @param 
	* @returns array 			Array of users
	*/
router.get('/', async (ctx, next) => {
	const allUsers = await db.User.findAll()
	ctx.body = allUsers
	await next()
})

/**
 * Get single user
 * 
 * @param integer
 * @returns object|null 	User object or null
 */
router.get('/:id', async (ctx, next) => {
	const user = await db.User.findById(ctx.params.id)	
	ctx.body = user
	await next()
})

/**
 * Create new user
 * 
 * @param object 					User object to be created
 * @returns object 				Newly created user object
 */
router.post('/', async (ctx, next) => {
	const user = await db.User.create(ctx.request.body)
	ctx.body = user
	await next()
})

/**
 * Update a user
 * 
 * @param object					New user data
 * @returns object 				Updated user object
 */
router.patch('/:id', async (ctx, next) => {
	const user = await db.User.findById(ctx.params.id)
	const updatedUser = await user.update(ctx.request.body)
	ctx.body = updatedUser
	await next()
})

/**
 * Delete user
 * 
 * @param integer					User id
 * @returns object|null 	Deleted user object
 */
router.delete('/:id', async (ctx, next) => {
	const user = await db.User.findById(ctx.params.id)
	const deleted = await user.destroy()
	ctx.body = deleted
	await next()
})

module.exports = router