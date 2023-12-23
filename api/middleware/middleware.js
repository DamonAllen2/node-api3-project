const User = require('../users/users-model')

function logger(req, res, next) {
  console.log(
    `[${new Date().toLocaleString()}] ${req.method} to ${req.url}`
  );
  next();
  
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const id = req.params.id
  try {
    const user = await User.getById(id);
    if (!user) {
      res.status(404).json({ message: "user not found" })
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(500).json({ message: "Error in server"})
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const name = req.body.name;
  if (!name || !name.trim()) {
    res.status(400).json({ message: `missing required name field` })
  } else {
    req.name = name.trim();
    next();
  }
  
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  next();
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}