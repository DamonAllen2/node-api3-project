const express = require('express');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')
const User = require('./users-model')
const Post = require(`../posts/posts-model`)
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  User.get()
  .then(users => {
    res.status(200).json(users)
  })
  // RETURN AN ARRAY WITH ALL THE USERS
});

router.get('/:id', validateUserId, (req, res) => {
  const user = req.user
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(user);
 

  console.log(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  User.insert({ name: req.name })
  .then(response => {
    res.status(201).json(response);
  })
  .catch(next);
  // this needs a middleware to check that the request body is valid
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const username = req.name;
  User.update(id,{ name: username})
  .then(response => {
    res.status(200).json(response);
  })
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  const id = req.params.id;
  const user = req.user;
  try {
  await User.remove(id);
  res.status(200).json(user)
  } catch (err) {
    next(err)
  }
  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  const id = req.params.id
  try {
    const posts = await User.getUserPosts(id);
    res.status(200).json(posts);
  } catch (err) {
    next(err)
  }
  // this needs a middleware to verify user id
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  const id = req.params.id;
  const text = req.text;
  try {
    const updated = await Post.insert({ user_id: id, text: text })
    res.status(201).json(updated)
  } catch (err) {
    next(err)
  }
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: `internal error` })
})

// do not forget to export the router
module.exports = router
