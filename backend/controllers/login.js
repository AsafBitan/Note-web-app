const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const User = require("../models/user");
const { response } = require("express");
const loger = require("../loger");

// Login user
loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  try {
    loger(request);
    const user = await User.findOne({ username });

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response
        .status(401)
        .json({ error: "invalid username or password" });
    }

    const userForToken = {
      name: user.name,
      email: user.email,
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
});

module.exports = loginRouter;
