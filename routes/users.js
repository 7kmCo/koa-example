const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');
const bcrypt = require('bcrypt');
const { authenticated } = require('../utils');
const User = require('../models/user')

const saltRounds = 10;

// User routes

/**
 * Login user.
 *
 * @param object				Object containing username and password
 * @returns array 			Array of users
 */
router.post('/login', async (ctx, next) => {
  return passport.authenticate('local', (err, user) => {
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401);
    } else {
      ctx.body = { success: true };
      return ctx.login(user);
    }
  })(ctx);
  await next();
});

/**
 * Login user.
 *
 * @param object				Object containing username and password
 * @returns array 			Array of users
 */
router.get('/logout', ctx => {
  ctx.logout();
  ctx.redirect('/');
});

/**
 * Get all users.
 *
 * @param
 * @returns array 			Array of users
 */
router.get('/', async (ctx, next) => {
  const allUsers = await User.findAll();
  ctx.body = allUsers;
  await next();
});

/**
 * Get single user
 *
 * @param integer
 * @returns object|null 	User object or null
 */
router.get('/:id', async (ctx, next) => {
  const user = await User.findById(ctx.params.id)
  if(user){
    ctx.body = user;
  } else{
    ctx.status = 404;
    ctx.body = `User with id ${ctx.params.id} was not found.`;
  }
});

/**
 * Authentication required
 *
 * @param integer
 * @returns object|null 	User object or null
 */
router.get('/auth/authenticated', authenticated(), async (ctx, next) => {
  ctx.body = { msg: 'Authenticated', user: ctx.state.user };
});

/**
 * Google authentication route
 *
 * @param
 * @returns
 */
router.get('/auth/google', passport.authenticate('google'));

/**
 * Google authentication callback
 *
 * @param
 * @returns
 */
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/users/auth/authenticated',
    failureRedirect: '/'
  })
);

/**
 * Facebook authentication route
 *
 * @param
 * @returns
 */
router.get('/auth/facebook', passport.authenticate('facebook'));

/**
 * Facebook authentication callback
 *
 * @param
 * @returns
 */
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/users/auth/authenticated',
    failureRedirect: '/'
  })
);

/**
 * Twitter authentication route
 *
 * @param
 * @returns
 */
router.get('/auth/twitter', passport.authenticate('twitter'));

/**
 * Twitter authentication callback
 *
 * @param
 * @returns
 */
router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/users/auth/authenticated',
    failureRedirect: '/'
  })
);

/**
 * LinkedIn authentication route
 *
 * @param
 * @returns
 */
router.get('/auth/linkedin', passport.authenticate('linkedin'));

/**
 * LinkedIn authentication callback
 *
 * @param
 * @returns
 */
router.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/users/auth/authenticated',
    failureRedirect: '/'
  })
);

/**
 * Create new user
 *
 * @param object 					User object to be created
 * @returns object|exception 				Newly created user object or exception
 */
router.post('/', async (ctx, next) => {
  ctx.checkBody('firstName', "First name can't be empty").notEmpty();
  ctx.checkBody('lastName', "Last name can't be empty.").notEmpty();
  ctx.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  ctx
    .checkBody('email', 'Email address must be between 4-100 characters long, please try again.')
    .len(4, 100);
  ctx.checkBody('password', 'Password must be between 8-100 characters long.').len(5, 100);
  const errors = await ctx.validationErrors();
  if (errors) {
    ctx.body = `There have been validation errors: ${errors}`;
  } else {
    ctx.request.body.password = await bcrypt.hash(ctx.request.body.password, saltRounds);
    try {
      const user = await User.create(ctx.request.body);
      ctx.body = user;
    } catch (error) {
      ctx.body = error;
    }
  }
  await next();
});

/**
 * Update a user
 *
 * @param object					New user data
 * @returns object 				Updated user object
 */
router.patch('/:id', async (ctx, next) => {
  try {
    const updatedUser = await User.update(ctx.params.id, ctx.request.body);
    ctx.body = updatedUser;
  } catch (error) {
    ctx.body = `There have been some errors: ${error}`;
  }
  await next();
});

/**
 * Delete user
 *
 * @param integer					User id
 * @returns object|null 	Deleted user object
 */
router.delete('/:id', async (ctx, next) => {
  try {
    await User.deleteById(ctx.params.id); //should be just disabled
    ctx.body = deleted;
  } catch (error) {
    ctx.body = `There have been some errors: ${error}`;
  }
  await next();
});

module.exports = router;
