const Router = require('koa-router')
const router = new Router()
const {User, Post} = require('../models')
const {authenticated} = require('../utils')

// Post routes

 /**
	* Get all posts.
	*
	* @param 
	* @returns array 			Array of posts
	*/
router.get('/', async (ctx, next) => {
	const allPosts = await Post.findAll()
	ctx.body = allPosts
	await next()
})

 /**
	* Get all users posts.
	*
	* @param 
	* @returns array 			Array of posts
	*/
router.get('/user-posts', authenticated(), async (ctx, next) => {
  const userId = ctx.state.user.id
  const allPosts = await Post.findAll({
    where: {
      AuthorId: userId
    }
  })
	ctx.body = allPosts
	await next()
})

/**
 * Get single post
 * 
 * @param integer
 * @returns object|null 	post object or null
 */
router.get('/single/:id', async (ctx, next) => {
	const post = await Post.findById(ctx.params.id)	
	ctx.body = post
	await next()
})

/**
 * Create new post
 * 
 * @param object 					Post object to be created
 * @returns object|exception 				Newly created post object or exception
 */
router.post('/', authenticated(), async (ctx, next) => {
	ctx.checkBody('title', 'Title can\'t be empty').notEmpty()
  ctx.checkBody('content', 'Content name can\'t be empty.').notEmpty()
	const errors = await ctx.validationErrors()
	if (errors) {
		ctx.body = `There have been validation errors: ${errors}`
	} else {
    ctx.request.body.AuthorId = ctx.state.user.id
		try {
      const post = await Post.create(ctx.request.body)
			ctx.body = post
		} catch (error) {
			ctx.body = error
		}
	}
	await next()
})

/**
 * Update a post
 * 
 * @param object					New post data
 * @returns object 				Updated post object
 */
router.patch('/:id', authenticated(), async (ctx, next) => {
  try {
    const post = await Post.findById(ctx.params.id)
	  const updatedPost = await post.update(ctx.request.body)
	  ctx.body = updatedPost
  } catch (error) {
    ctx.body = `There have been some errors: ${error}`
  }
	await next()
})

/**
 * Delete a post
 * 
 * @param integer					Post id
 * @returns object|null 	Deleted post object
 */
router.delete('/:id', authenticated(), async (ctx, next) => {
  try {
    const post = await Post.findById(ctx.params.id)
    const deleted = await post.destroy()
    ctx.body = deleted
  } catch (error) {
    ctx.body = `There have been some errors: ${error}`
  }
	await next()
})

module.exports = router